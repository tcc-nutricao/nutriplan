import { MealPlanController } from '../controllers/MealPlanController.js'
import { generateCrudApi } from './Api.js'

export const api = {
  ...generateCrudApi(MealPlanController),
  getMealPlanByPatient: MealPlanController.getMealPlanByPatient,
  generateAutomaticPlan: MealPlanController.generateAutomaticPlan,
  generateSelfService: MealPlanController.generateSelfService,
  assignPlan: MealPlanController.assignPlan
}
