import { RecipeRepository } from '../repositories/RecipeRepository.js'
import { generateCrudService } from './Service.js'

export const RecipeService = generateCrudService(RecipeRepository)


