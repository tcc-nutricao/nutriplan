import { api } from "../api/PatientApi.js"
import { genericRoute } from "./Route.js"
import { validate } from '../api/AuthApi.js'

export default (router) => {
  genericRoute(router, '/patient', api)
}