import { api } from "../api/MealPlanApi.js"
import { genericRoute } from "./Route.js"
import { validate } from '../api/AuthApi.js'

export default (router) => {
  genericRoute(router, '/meal-plan', api)
  
  // Rota customizada para buscar meal plans por paciente
  router.get('/meal-plan/patient/:patientId', validate, api.getMealPlanByPatient)
}