import { FoodConsumedRepository } from '../repositories/FoodConsumedRepository.js'
import { generateCrudService } from './Service.js'

export const FoodConsumedService = generateCrudService(FoodConsumedRepository)


