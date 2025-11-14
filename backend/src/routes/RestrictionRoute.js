import { api } from "../api/RestrictionApi.js"
import { genericRoute } from "./Route.js"

export default (router) => {
  genericRoute(router, '/restriction', api)
}