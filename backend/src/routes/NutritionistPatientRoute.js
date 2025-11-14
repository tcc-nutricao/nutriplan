import { authorize } from '../middleware/index.js'
import { api } from '../api/NutritionistPatientApi.js'
import { Roles } from '../config/roles.js'
import { genericRoute } from './Route.js'

export default (router) => {
  genericRoute(router, '/nutritionist-patient', api, authorize(Roles.PROFESSIONAL))
}
