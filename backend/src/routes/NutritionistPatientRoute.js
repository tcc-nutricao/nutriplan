import { authorize } from '../middleware/index.js'
import { api } from '../api/NutritionistPatientApi.js'
import { Roles } from '../config/roles.js'
import { genericRoute } from './Route.js'
import { authenticate } from '../middleware/index.js'

export default (router) => {
  genericRoute(router, '/nutritionist-patient', authenticate, api, authorize(Roles.PROFESSIONAL))
}
