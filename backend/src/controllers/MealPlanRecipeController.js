import { MealPlanRecipeService } from '../services/MealPlanRecipeService.js'
import { CreateMealPlanRecipeSchema } from '../dtos/mealPlanRecipe/CreateMealPlanRecipeDto.js'
import { generateCrudController } from './Controller.js'

export const MealPlanRecipeController = generateCrudController(
  MealPlanRecipeService,
  CreateMealPlanRecipeSchema,
  'Receita do plano de refeições'
)


