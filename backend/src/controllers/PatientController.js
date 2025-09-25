import { PatientService } from '../services/PatientService.js'
import { CreatePatientSchema } from '../dtos/patient/CreatePatientDto.js'
import { generateCrudController } from './Controller.js'

// Métodos customizados específicos do MealPlan ...

// Mescla CRUD padrão com métodos customizados
export const PatientController = {
  ...generateCrudController(
    PatientService,
    CreatePatientSchema,
    'Paciente'
  )
}


