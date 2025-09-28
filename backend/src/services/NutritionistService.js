import { NutritionistRepository } from '../repositories/NutritionistRepository.js'
import { generateCrudService } from './Service.js'

export const NutritionistService = generateCrudService(NutritionistRepository)
