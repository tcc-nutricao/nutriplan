import { NutritionistPatientController } from '../controllers/NutritionistPatientController.js'
import { generateCrudApi } from './Api.js'

export const api = {
  ...generateCrudApi(NutritionistPatientController),
}