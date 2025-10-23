import { api } from "../api/PatientApi.js"
import { genericRoute } from "./Route.js"
import { validate } from '../api/AuthApi.js'

export default (router) => {
  genericRoute(router, '/patient', api)
  
  // Rota customizada para progresso do paciente
  router.get('/patient/:id/progress', validate, api.getProgress)
}