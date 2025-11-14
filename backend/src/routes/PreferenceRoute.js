import { api } from "../api/PreferenceApi.js"
import { genericRoute } from "./Route.js"

export default (router) => {
  genericRoute(router, '/preference', api)
}