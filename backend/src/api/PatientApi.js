import { PatientController } from '../controllers/PatientController.js'
import { generateCrudApi } from './Api.js'

export const api = {
  ...generateCrudApi(PatientController),
  getProgress: PatientController.getProgress
}