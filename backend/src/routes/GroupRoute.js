import { api } from "../api/GroupApi.js"
import { genericRoute } from "./Route.js"
import { authenticate, authorize } from '../middleware/index.js'
import { Roles } from "../config/roles.js";
import { GroupController } from '../controllers/GroupController.js'

export default (router) => {
  router.post(
    '/group',
    authenticate,
    authorize(Roles.STANDARD),
    GroupController.createGroupWithUser
  )

  router.get('/group/progress', authenticate, authorize(Roles.STANDARD), api.getGroupsProgressByUser)
  router.post('/group/join', authenticate, authorize(Roles.STANDARD), GroupController.joinGroup)
  router.post('/group/leave', authenticate, authorize(Roles.STANDARD), GroupController.leaveGroup)
  router.delete('/group/:id', authenticate, authorize(Roles.STANDARD), GroupController.deleteGroup)

  genericRoute(router, '/group', api, authenticate, authorize(Roles.STANDARD))
}