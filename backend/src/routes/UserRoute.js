import { api } from "../api/UserApi.js"
import { genericRoute } from "./Route.js"

export default (router) => {
  genericRoute(router, '/user', api)
}