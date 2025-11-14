import { api } from "../api/GroupApi.js"
import { genericRoute } from "./Route.js"
import { authenticate, authorize } from '../middleware/index.js'
import { Roles } from "../config/roles.js";

export default (router) => {
  genericRoute(router, '/group', api)
  router.get('/group/progress', authenticate, authorize(Roles.STANDARD), api.getGroupsProgressByUser)
}