import { MealPlanRecipeRepository } from '../repositories/MealPlanRecipeRepository.js'
import { generateCrudService } from './Service.js'

export const MealPlanRecipeService = generateCrudService(MealPlanRecipeRepository)


