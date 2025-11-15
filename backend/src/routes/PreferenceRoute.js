import { api } from "../api/PreferenceApi.js"
import { genericRoute } from "./Route.js"
import { authenticate } from '../middleware/index.js'

export default (router) => {
  genericRoute(router, '/preference', api, authenticate)
}