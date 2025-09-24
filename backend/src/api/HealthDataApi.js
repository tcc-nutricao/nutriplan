import { HealthDataController } from '../controllers/HealthDataController.js'
import { generateCrudApi } from './Api.js'

// Mescla CRUD padrão com métodos customizados do controller
export const api = {
  ...generateCrudApi(HealthDataController),
  // Métodos customizados já estão disponíveis no HealthDataController
}