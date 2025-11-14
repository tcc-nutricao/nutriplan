import { api } from "../api/GroupApi.js"
import { genericRoute } from "./Route.js"
import { authenticate } from '../api/AuthApi.js'

export default (router) => {
  genericRoute(router, '/group', api)
  router.get('/group/progress', authenticate, api.getGroupsProgressByUser)
}