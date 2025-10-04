import { MealPlanMealService } from '../services/MealPlanMealService.js'
import { CreateMealPlanMealSchema } from '../dtos/mealPlanMeal/CreateMealPlanMealDto.js'
import { generateCrudController } from './Controller.js'

// Métodos customizados específicos do MealPlan ...

// Mescla CRUD padrão com métodos customizados
export const MealPlanMealController = {
  ...generateCrudController(
    MealPlanMealService,
    CreateMealPlanMealSchema,
    'Refeição do plano alimentar'
  )
}


