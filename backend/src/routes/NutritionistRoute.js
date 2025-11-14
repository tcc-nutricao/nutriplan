import { api } from "../api/NutritionistApi.js"
import { genericRoute } from "./Route.js"
import { authenticate } from '../api/AuthApi.js'

export default (router) => {
  genericRoute(router, '/nutritionist', api)
  router.get("/nutritionist/patients", authenticate, api.getPatients)
  router.get("/nutritionist/patients/:id", authenticate, api.getPatientInfo)
}