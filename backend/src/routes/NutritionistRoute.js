import { api } from "../api/NutritionistApi.js"
import { genericRoute } from "./Route.js"
import { authenticate, authorize } from '../middleware/index.js'
import { Roles } from '../config/roles.js'

export default (router) => {
  genericRoute(router, '/nutritionist', api, authenticate, authorize(Roles.PROFESSIONAL))
  router.get("/nutritionist/patients", authenticate, authorize(Roles.PROFESSIONAL), api.getPatients)
  router.get("/nutritionist/patients/:id", authenticate, authorize(Roles.PROFESSIONAL), api.getPatientInfo)
}