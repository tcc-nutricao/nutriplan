import { generateCrudRepository } from './Repository.js';

export const ObjectiveRepository = generateCrudRepository('objective', {
	softDelete: true,
	defaultOrderBy: 'id',
	defaultIncludes: {
		goalObjectives: true
	}
});