import { api } from "../api/GoalObjectiveApi.js"
import { genericRoute } from "./Route.js"
import { validate } from '../api/AuthApi.js'

export default (router) => {
  genericRoute(router, '/goal-objective', api)
}