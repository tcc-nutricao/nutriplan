import { api } from "../api/MealPlanMealApi.js"
import { genericRoute } from "./Route.js"

export default (router) => {
  genericRoute(router, '/meal-plan-meal', api)
}