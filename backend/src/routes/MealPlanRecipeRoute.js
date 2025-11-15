import { api } from "../api/MealPlanRecipeApi.js"
import { genericRoute } from "./Route.js"
import { authenticate } from '../middleware/index.js'

export default (router) => {
  genericRoute(router, '/meal-plan-recipe', api, authenticate)
}