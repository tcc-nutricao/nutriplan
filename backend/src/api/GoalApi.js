import { GoalController } from '../controllers/GoalController.js'
import { generateCrudApi } from './Api.js'

export const api = {
  ...generateCrudApi(GoalController),
}