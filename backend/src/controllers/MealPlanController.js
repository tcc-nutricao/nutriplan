import { MealPlanService } from '../services/MealPlanService.js'
import { CreateMealPlanSchema } from '../dtos/mealPlan/CreateMealPlanDto.js'
import { generateCrudController } from './Controller.js'

// Métodos customizados específicos do MealPlan


// Mescla CRUD padrão com métodos customizados
export const MealPlanController = {
  ...generateCrudController(
    MealPlanService,
    CreateMealPlanSchema,
    'Plano alimentar'
  )
}


