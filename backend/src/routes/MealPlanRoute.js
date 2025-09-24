import { api } from "../api/MealPlanApi.js"
import { genericRoute } from "./Route.js"

export default (router) => {
  genericRoute(router, '/meal-plan', api)
}