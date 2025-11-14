import { api } from "../api/UserApi.js"
import { genericRoute } from "./Route.js"
import { authenticate } from "../api/AuthApi.js"

export default (router) => {
  genericRoute(router, '/user', api)
  router.post('/user/temporary', api.createTemporaryUser)
  router.patch('/user', authenticate, api.update)
  router.delete('/user', authenticate, api.remove)
}