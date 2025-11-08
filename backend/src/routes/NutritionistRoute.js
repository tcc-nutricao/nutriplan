import { api } from "../api/NutritionistApi.js"
import { genericRoute } from "./Route.js"
import { validate } from '../api/AuthApi.js'

export default (router) => {
  genericRoute(router, '/nutritionist', api)
  router.get("/nutritionist/patients", validate, api.getPatients)
}