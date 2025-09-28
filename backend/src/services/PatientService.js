import { PatientRepository } from '../repositories/PatientRepository.js'
import { generateCrudService } from './Service.js'

export const PatientService = generateCrudService(PatientRepository)