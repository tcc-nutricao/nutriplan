import { generateCrudRepository } from './Repository.js';

export const PreferenceRepository = generateCrudRepository('preference', {
  softDelete: true,
  defaultOrderBy: 'id'
});
