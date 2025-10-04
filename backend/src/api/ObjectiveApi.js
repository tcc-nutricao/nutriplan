import { ObjectiveController } from '../controllers/ObjectiveController.js'
import { generateCrudApi } from './Api.js'

// Mescla CRUD padrão com métodos customizados do controller
export const api = {
  ...generateCrudApi(ObjectiveController),
  // Métodos customizados já estão disponíveis no ObjectiveController
}