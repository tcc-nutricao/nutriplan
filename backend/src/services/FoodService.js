import { FoodRepository } from '../repositories/FoodRepository.js'
import { generateCrudService } from './Service.js'

export const FoodService = generateCrudService(FoodRepository)


