import { FoodConsumedService } from '../services/FoodConsumedService.js'
import { CreateFoodConsumedSchema } from '../dtos/foodConsumed/CreateFoodConsumedDto.js'
import { generateCrudController } from './Controller.js'

// Métodos customizados específicos do MealPlan ...

// Mescla CRUD padrão com métodos customizados
export const FoodConsumedController = {
  ...generateCrudController(
    FoodConsumedService,
    CreateFoodConsumedSchema,
    'Alimento consumido'
  )
}


