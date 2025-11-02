import { api } from "../api/GroupApi.js"
import { genericRoute } from "./Route.js"
import { validate } from '../api/AuthApi.js'

export default (router) => {
  genericRoute(router, '/group', api)
  router.get('/group/progress', validate, api.getGroupsProgressByUser)
}