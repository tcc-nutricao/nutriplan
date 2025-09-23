import { FoodConsumed } from '../controllers/FoodConsumedController.js'
import { generateCrudApi } from './Api.js'

export const api = generateCrudApi(FoodConsumed)
