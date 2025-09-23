import { MealPlanController } from '../controllers/MealPlanController.js'
import { generateCrudApi } from './Api.js'

export const api = generateCrudApi(MealPlanController)
