import { RecipeService } from '../services/RecipeService.js'
import { CreateRecipeSchema } from '../dtos/recipe/CreateRecipeDto.js'
import { generateCrudController } from './Controller.js'

export const RecipeController = generateCrudController(
  RecipeService,
  CreateRecipeSchema,
  'Receita'
)


