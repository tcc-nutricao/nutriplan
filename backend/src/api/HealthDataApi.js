import { HealthDataController } from '../controllers/HealthDataController.js'
import { generateCrudApi } from './Api.js'

export const api = generateCrudApi(HealthDataController)
