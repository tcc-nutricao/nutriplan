import { NutritionistPatientController } from '../controllers/NutritionistPatientController.js'
import { generateCrudApi } from './Api.js'

// Mescla CRUD padrão com métodos customizados do controller
export const api = {
  ...generateCrudApi(NutritionistPatientController),
  // Métodos customizados já estão disponíveis no NutritionistPatientController
}