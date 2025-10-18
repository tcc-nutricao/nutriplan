import { PatientController } from '../controllers/PatientController.js'
import { generateCrudApi } from './Api.js'

// Mescla CRUD padrão com métodos customizados do controller
export const api = {
  ...generateCrudApi(PatientController),
  getProgress: PatientController.getProgress
}