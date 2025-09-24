import { RecipeController } from '../controllers/RecipeController.js'
import { generateCrudApi } from './Api.js'

// Mescla CRUD padrão com métodos customizados do controller
export const api = {
  ...generateCrudApi(RecipeController),
  // Métodos customizados já estão disponíveis no RecipeController
}