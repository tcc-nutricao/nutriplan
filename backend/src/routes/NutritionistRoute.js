import { api } from "../api/NutritionistApi.js"
import { genericRoute } from "./Route.js"
import { authenticate, authorize } from '../middleware/index.js'
import { Roles } from '../config/roles.js'

export default (router) => {
  router.get("/nutritionist/patients", authenticate, authorize(Roles.PROFESSIONAL), api.getPatients)
  router.get("/nutritionist/patients/:id", authenticate, authorize(Roles.PROFESSIONAL), api.getPatientInfo)
  router.post("/nutritionist/invite-code", authenticate, authorize(Roles.PROFESSIONAL), api.generateInviteCode)
  router.get("/nutritionist/invite-code", authenticate, authorize(Roles.PROFESSIONAL), api.getInviteCode)
  router.post("/nutritionist/link-patient", authenticate, authorize(Roles.STANDARD), api.linkPatientByCode)
  
  genericRoute(router, '/nutritionist', api, authenticate, authorize(Roles.PROFESSIONAL))
}