import { GoalRepository } from '../repositories/GoalRepository.js'
import { generateCrudService } from './Service.js'

export const GoalService = generateCrudService(GoalRepository)


