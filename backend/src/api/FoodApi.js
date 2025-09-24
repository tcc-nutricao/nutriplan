import { FoodController } from '../controllers/FoodController.js'
import { generateCrudApi } from './Api.js'

// Mescla CRUD padrão com métodos customizados do controller
export const api = {
  ...generateCrudApi(FoodController),
  // Métodos customizados já estão disponíveis no FoodController
}