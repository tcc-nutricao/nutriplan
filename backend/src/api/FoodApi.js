import { FoodController } from '../controllers/FoodController.js'
import { generateCrudApi } from './Api.js'

export const api = generateCrudApi(FoodController)
