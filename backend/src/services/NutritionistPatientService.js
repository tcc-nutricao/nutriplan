import { NutritionistPatientRepository } from '../repositories/NutritionistPatientRepository.js'
import { generateCrudService } from './Service.js'

export const NutritionistPatientService = generateCrudService(NutritionistPatientRepository)


