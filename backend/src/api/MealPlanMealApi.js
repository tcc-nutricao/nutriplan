import { MealPlanMealController } from '../controllers/MealPlanMealController.js'
import { generateCrudApi } from './Api.js'

// Mescla CRUD padrão com métodos customizados do controller
export const api = {
  ...generateCrudApi(MealPlanMealController),
  // Métodos customizados já estão disponíveis no MealPlanMealController
}