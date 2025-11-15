import { api } from "../api/MealPlanMealApi.js"
import { genericRoute } from "./Route.js"
import { authenticate } from '../middleware/index.js'

export default (router) => {
  genericRoute(router, '/meal-plan-meal', api, authenticate)
}