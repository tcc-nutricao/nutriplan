import { PreferenceService } from '../services/PreferenceService.js'
import { CreatePreferenceSchema } from '../dtos/preference/CreatePreferenceDto.js'
import { generateCrudController } from './Controller.js'

export const PreferenceController = generateCrudController(
  PreferenceService,
  CreatePreferenceSchema,
  'Preferência'
)


