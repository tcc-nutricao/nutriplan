import { NutritionistController } from '../controllers/NutritionistController.js'
import { generateCrudApi } from './Api.js'

// Mescla CRUD padrão com métodos customizados do controller
export const api = {
  ...generateCrudApi(NutritionistController),
  // Métodos customizados já estão disponíveis no NutritionistController
}