import { api } from "../api/MealPlanApi.js"
import { genericRoute } from "./Route.js"
import { authenticate, authorize } from '../middleware/index.js'
import { Roles } from '../config/roles.js'
import { MealPlanPopulateController } from '../controllers/MealPlanPopulateController.js'

export default (router) => {
  genericRoute(router, '/meal-plan', api, authenticate)
  router.get('/get-patient-meal-plan', authenticate, authorize(Roles.STANDARD), api.getMealPlanByPatient)
  router.post('/meal-plan/:id/populate', authenticate, MealPlanPopulateController.populateMealPlan)
}