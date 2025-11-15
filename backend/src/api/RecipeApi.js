import { RecipeController } from '../controllers/RecipeController.js'
import { generateCrudApi } from './Api.js'

export const api = {
  ...generateCrudApi(RecipeController),
  getPatientRecipes: RecipeController.getPatientRecipes
}