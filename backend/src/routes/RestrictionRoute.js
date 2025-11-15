import { api } from "../api/RestrictionApi.js"
import { genericRoute } from "./Route.js"
import { authenticate } from '../middleware/index.js'

export default (router) => {
  genericRoute(router, '/restriction', api, authenticate)
}