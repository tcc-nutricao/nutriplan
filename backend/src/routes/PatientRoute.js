import { api } from "../api/PatientApi.js"
import { genericRoute } from "./Route.js"
import { authenticate } from '../api/AuthApi.js'

export default (router) => {
  genericRoute(router, '/patient', api)
  router.get('/patient/:id/progress', authenticate, api.getProgress)
}