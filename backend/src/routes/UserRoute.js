import { api } from "../api/UserApi.js"
import { genericRoute } from "./Route.js"
import { validate } from "../api/AuthApi.js"

export default (router) => {
  genericRoute(router, '/user', api)
  router.post('/user/temporary', api.createTemporaryUser)
  router.patch('/user', validate, api.update)
  router.delete('/user', validate, api.remove)
}