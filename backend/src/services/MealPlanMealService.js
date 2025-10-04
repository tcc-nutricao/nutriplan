import { MealPlanMealRepository } from '../repositories/MealPlanMealRepository.js'
import { generateCrudService } from './Service.js'

export const MealPlanMealService = generateCrudService(MealPlanMealRepository)
