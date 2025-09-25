import { FoodService } from '../services/FoodService.js'
import { CreateFoodSchema } from '../dtos/food/CreateFoodDto.js'
import { generateCrudController } from './Controller.js'

export const FoodController = generateCrudController(
  FoodService,
  CreateFoodSchema,
  'Alimento'
)


