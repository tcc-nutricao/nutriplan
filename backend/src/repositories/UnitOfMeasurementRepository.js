import { generateCrudRepository } from './Repository.js';

export const UnitOfMeasurementRepository = generateCrudRepository('unitOfMeasurement', {
  softDelete: true,
  defaultOrderBy: 'id',
  defaultIncludes: {
    foodConsumed: true,
    recipeFood: true
  }
});
