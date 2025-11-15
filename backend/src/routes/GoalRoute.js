import { api } from "../api/GoalApi.js"
import { genericRoute } from "./Route.js"
import { authenticate } from '../middleware/index.js'

export default (router) => {
  genericRoute(router, '/goal', api, authenticate)
}