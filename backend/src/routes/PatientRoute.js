import { api } from "../api/PatientApi.js"
import { genericRoute } from "./Route.js"
import { authenticate, authorize } from '../middleware/index.js'
import { Roles } from "../config/roles.js";

export default (router) => {
  genericRoute(router, '/patient', api, authorize(Roles.STANDARD))
  router.get('/patient/:id/progress', authenticate, authorize(Roles.STANDARD), api.getProgress)
}