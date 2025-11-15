import { api } from "../api/GoalObjectiveApi.js"
import { genericRoute } from "./Route.js"
import { authenticate } from '../middleware/index.js'

export default (router) => {
  genericRoute(router, '/goal-objective', api, authenticate)
}