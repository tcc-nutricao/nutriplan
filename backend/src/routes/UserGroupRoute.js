import { api } from "../api/UserGroupApi.js"
import { genericRoute } from "./Route.js"
import { Roles } from "../config/roles.js";
import { authenticate, authorize } from '../middleware/index.js'

export default (router) => {
  genericRoute(router, '/user-group', api, authenticate, authorize(Roles.STANDARD))
}