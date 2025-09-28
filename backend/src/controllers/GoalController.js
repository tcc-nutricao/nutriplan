import { GoalService } from '../services/GoalService.js'
import { CreateGoalSchema } from '../dtos/goal/CreateGoalDto.js'
import { generateCrudController } from './Controller.js'

// Métodos customizados específicos do Goal ...

// Mescla CRUD padrão com métodos customizados
export const GoalController = {
  ...generateCrudController(
    GoalService,
    CreateGoalSchema,
    'Objetivo'
  )
}


