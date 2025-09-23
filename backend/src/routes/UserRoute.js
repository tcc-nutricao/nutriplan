import { UserApi } from "../api/UserApi"
import { genericRoute } from "./Route"

export default (router) => {
  genericRoute(router, '/user', UserApi)
}