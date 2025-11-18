import { api } from "../api/UserApi.js"
import { genericRoute } from "./Route.js"
import { authenticate, authorize } from "../middleware/index.js"
import { Roles } from "../config/roles.js";

export default (router) => {
  genericRoute(router, '/user', api)
  router.get('/user/profile_picture', authenticate, api.getProfilePicture)
  router.post('/user/temporary', authenticate, authorize(Roles.PROFESSIONAL), api.createTemporaryUser)
  router.patch('/user', authenticate, api.update)
  router.delete('/user', authenticate, api.remove)
}