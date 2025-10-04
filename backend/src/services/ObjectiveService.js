import { ObjectiveRepository } from '../repositories/ObjectiveRepository.js'
import { generateCrudService } from './Service.js'

export const ObjectiveService = generateCrudService(ObjectiveRepository)


