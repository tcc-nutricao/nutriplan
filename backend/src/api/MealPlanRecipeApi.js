import { MealPlanRecipeController } from '../controllers/MealPlanRecipeController.js'
import { generateCrudApi } from './Api.js'

export const api = {
  ...generateCrudApi(MealPlanRecipeController),
}