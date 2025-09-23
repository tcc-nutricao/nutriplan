import { MealPlanApi } from "../api/MealPlanApi"
import { genericRoute } from "./Route"

export default (router) => {
  genericRoute(router, '/meal-plan', MealPlanApi)
}