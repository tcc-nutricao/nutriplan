import { NutritionistPatientService } from '../services/NutritionistPatientService.js'
import { CreateNutritionistPatientSchema } from '../dtos/nutritionistPatient/CreateNutritionistPatientDto.js'
import { generateCrudController } from './Controller.js'

export const NutritionistPatientController = generateCrudController(
  NutritionistPatientService,
  CreateNutritionistPatientSchema,
  'Paciente do nutricionista'
)


