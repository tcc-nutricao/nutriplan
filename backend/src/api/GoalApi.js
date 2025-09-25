import { GoalController } from '../controllers/GoalController.js'
import { generateCrudApi } from './Api.js'

// Mescla CRUD padrão com métodos customizados do controller
export const api = {
  ...generateCrudApi(GoalController),
  // Métodos customizados já estão disponíveis no GoalController
}