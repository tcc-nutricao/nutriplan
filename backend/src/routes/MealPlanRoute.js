import { api } from "../api/MealPlanApi.js"
import { genericRoute } from "./Route.js"
import { authenticate, authorize } from '../middleware/index.js'
import { Roles } from '../config/roles.js'
import { MealPlanPopulateController } from '../controllers/MealPlanPopulateController.js'

export default (router) => {
  genericRoute(router, '/meal-plan', api, authenticate)
  router.get('/get-patient-meal-plan', authenticate, authorize(Roles.STANDARD), api.getMealPlanByPatient)
  router.post('/meal-plan/generate-auto', authenticate, authorize(Roles.PROFESSIONAL), api.generateAutomaticPlan)
  router.post('/meal-plan/generate-self', authenticate, authorize(Roles.STANDARD), api.generateSelfService)
  router.post('/meal-plan/:id/assign', authenticate, authorize(Roles.PROFESSIONAL), api.assignPlan)
  router.post('/meal-plan/:id/populate', authenticate, MealPlanPopulateController.populateMealPlan)
  router.put('/meal-plan/:id/full', authenticate, authorize(Roles.PROFESSIONAL), api.updateFull)
}