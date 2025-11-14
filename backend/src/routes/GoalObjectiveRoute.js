import { api } from "../api/GoalObjectiveApi.js"
import { genericRoute } from "./Route.js"

export default (router) => {
  genericRoute(router, '/goal-objective', api)
}