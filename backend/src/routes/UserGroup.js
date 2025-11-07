import { api } from "../api/UserGroupApi.js"
import { genericRoute } from "./Route.js"

export default (router) => {
  genericRoute(router, '/user-group', api)
}