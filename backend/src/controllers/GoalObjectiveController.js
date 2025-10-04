import { GoalObjectiveService } from '../services/GoalObjectiveService.js'
import { CreateGoalObjectiveSchema } from '../dtos/goalObjective/CreateGoalObjectiveDto.js'
import { generateCrudController } from './Controller.js'

export const GoalObjectiveController = generateCrudController(
  GoalObjectiveService,
  CreateGoalObjectiveSchema,
  'Objetivo da Meta'
)

