import { GoalObjectiveController } from '../controllers/GoalObjectiveController.js'
import { generateCrudApi } from './Api.js'

// Mescla CRUD padrão com métodos customizados do controller
export const api = {
  ...generateCrudApi(GoalObjectiveController),
  // Métodos customizados já estão disponíveis no GoalObjectiveController
}