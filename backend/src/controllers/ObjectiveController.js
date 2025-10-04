import { ObjectiveService } from '../services/ObjectiveService.js'
import { CreateObjectiveSchema } from '../dtos/objective/CreateObjectiveDto.js'
import { generateCrudController } from './Controller.js'

// Métodos customizados específicos do Objective ...

// Mescla CRUD padrão com métodos customizados
export const ObjectiveController = {
  ...generateCrudController(
    ObjectiveService,
    CreateObjectiveSchema,
    'Objetivo'
  )
}


