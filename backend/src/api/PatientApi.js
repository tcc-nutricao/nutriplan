import { PatientController } from '../controllers/PatientController.js'
import { generateCrudApi } from './Api.js'

export const api = {
  ...generateCrudApi(PatientController),
  getProgress: PatientController.getProgress,
  createFull: PatientController.createFull,
  getAll: PatientController.getAll,
  update: PatientController.update,
  deletePatient: PatientController.deletePatient,
  unlinkNutritionist: PatientController.unlinkNutritionist
}