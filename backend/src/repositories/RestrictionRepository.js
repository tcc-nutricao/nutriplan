import { generateCrudRepository } from './Repository.js';

export const RestrictionRepository = generateCrudRepository('dietaryRestriction', {
  softDelete: true,
  defaultOrderBy: 'id'
});
