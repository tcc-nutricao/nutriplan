import { api } from '../api/NutritionistPatientApi.js'
import { genericRoute } from './Route.js'

export default (router) => {
  genericRoute(router, '/nutritionist-patient', api)
}
