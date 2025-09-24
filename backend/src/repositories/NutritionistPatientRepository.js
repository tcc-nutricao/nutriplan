import { generateCrudRepository } from './Repository.js'

export const NutritionistPatientRepository = generateCrudRepository('nutritionistpatient', {
  softDelete: true,
  defaultOrderBy: 'id',
  defaultIncludes: {
    patient: true
  }
})
