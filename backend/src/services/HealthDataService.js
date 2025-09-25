import { HealthDataRepository } from '../repositories/HealthDataRepository.js'
import { generateCrudService } from './Service.js'

export const HealthDataService = generateCrudService(HealthDataRepository)


