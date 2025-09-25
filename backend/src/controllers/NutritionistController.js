import { NutritionistService } from '../services/NutritionistService.js'
import { CreateNutritionistSchema } from '../dtos/nutritionist/CreateNutritionistDto.js'
import { generateCrudController } from './Controller.js'

// Métodos customizados específicos do MealPlan ...

// Mescla CRUD padrão com métodos customizados
export const NutritionistController = {
  ...generateCrudController(
    NutritionistService,
    CreateNutritionistSchema,
    'Nutricionista'
  )
}


