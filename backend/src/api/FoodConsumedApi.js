import { FoodConsumedController } from '../controllers/FoodConsumedController.js'
import { generateCrudApi } from './Api.js'

// Mescla CRUD padrão com métodos customizados do controller
export const api = {
  ...generateCrudApi(FoodConsumedController),
  // Métodos customizados já estão disponíveis no FoodConsumedController
}