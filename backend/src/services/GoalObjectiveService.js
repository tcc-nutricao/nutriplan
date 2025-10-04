import { GoalObjectiveRepository } from '../repositories/GoalObjectiveRepository.js'
import { generateCrudService } from './Service.js'

export const GoalObjectiveService = generateCrudService(GoalObjectiveRepository)
