import { api } from "../api/MealPlanApi.js"
import { genericRoute } from "./Route.js"
import { authenticate } from '../middleware/index.js'

export default (router) => {
  genericRoute(router, '/meal-plan', api)
  router.get('/meal-plan/patient/:patientId', authenticate, api.getMealPlanByPatient)
}