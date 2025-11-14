import { GoalObjectiveController } from '../controllers/GoalObjectiveController.js'
import { generateCrudApi } from './Api.js'

export const api = {
  ...generateCrudApi(GoalObjectiveController)
}