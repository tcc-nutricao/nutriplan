import { api } from "../api/GoalApi.js"
import { genericRoute } from "./Route.js"

export default (router) => {
  genericRoute(router, '/goal', api)
}