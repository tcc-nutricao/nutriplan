import { generateCrudRepository } from './Repository.js'

export const HealthDataRepository = generateCrudRepository('healthData', {
  softDelete: true,
  defaultOrderBy: 'id',
  defaultIncludes: {
    patient: true
  }
})
