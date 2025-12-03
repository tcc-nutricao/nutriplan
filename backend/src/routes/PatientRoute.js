import { api } from "../api/PatientApi.js"
import { genericRoute } from "./Route.js"
import { authenticate, authorize } from '../middleware/index.js'
import { Roles } from "../config/roles.js";

export default (router) => {
  router.post('/patient/create-full', authenticate, authorize(Roles.PROFESSIONAL), api.createFull)
  router.get('/patient/all', authenticate, authorize(Roles.PROFESSIONAL), api.getAll)
  router.get('/patient/progress', authenticate, authorize(Roles.STANDARD), api.getProgress)
  router.patch('/patient/:id', authenticate, authorize(Roles.PROFESSIONAL), api.update)
  router.delete('/patient/nutritionist', authenticate, authorize(Roles.STANDARD), api.unlinkNutritionist)
  router.delete('/patient/:id', authenticate, authorize(Roles.PROFESSIONAL), api.deletePatient)
  genericRoute(router, '/patient', api, authenticate, authorize(Roles.STANDARD))
}