import { RestrictionService } from '../services/RestrictionService.js'
import { CreateRestrictionSchema } from '../dtos/restriction/CreateRestrictionDto.js'
import { generateCrudController } from './Controller.js'

export const RestrictionController = generateCrudController(
  RestrictionService,
  CreateRestrictionSchema,
  'Restrição'
)


