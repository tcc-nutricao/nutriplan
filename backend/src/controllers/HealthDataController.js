import { HealthDataService } from '../services/HealthDataService.js'
import { CreateHealthDataSchema } from '../dtos/healthData/CreateHealthDataDto.js'
import { generateCrudController } from './Controller.js'

export const HealthDataController = generateCrudController(
  HealthDataService,
  CreateHealthDataSchema,
  'Dados de saúde'
)


