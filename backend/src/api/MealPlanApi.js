import { MealPlanController } from '../controllers/MealPlanController.js'
import { generateCrudApi } from './Api.js'

// Mescla CRUD padrão com métodos customizados do controller
export const api = {
  ...generateCrudApi(MealPlanController),
  getMealPlanByPatient: MealPlanController.getMealPlanByPatient
}
