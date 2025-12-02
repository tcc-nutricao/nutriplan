import { NutritionistController } from '../controllers/NutritionistController.js'
import { generateCrudApi } from './Api.js'

// Mescla CRUD padrão com métodos customizados do controller
export const api = {
  ...generateCrudApi(NutritionistController),
  getPatients: NutritionistController.getPatients,
  getPatientInfo: NutritionistController.getPatientInfo,
  generateInviteCode: NutritionistController.generateInviteCode,
  getInviteCode: NutritionistController.getInviteCode,
  linkPatientByCode: NutritionistController.linkPatientByCode,
}