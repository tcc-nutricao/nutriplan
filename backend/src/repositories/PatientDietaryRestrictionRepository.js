import { generateCrudRepository } from './Repository.js'

export const PatientDietaryRestrictionRepository = generateCrudRepository('patientDietaryRestriction', {
  softDelete: true, 
  defaultOrderBy: 'id',
  defaultIncludes: {
    dietaryRestriction: true,
    patient: false
  }
})
