import { api } from '../api/NutritionistPatientApi.js'
import { Roles } from '../config/roles.js'
import { genericRoute } from './Route.js'
import { authenticate, authorize } from '../middleware/index.js'

export default (router) => {
  genericRoute(router, '/nutritionist-patient', api, authenticate, authorize(Roles.PROFESSIONAL))
}
