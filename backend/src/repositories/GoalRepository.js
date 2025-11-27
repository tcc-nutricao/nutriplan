import { generateCrudRepository } from './Repository.js';

export const GoalRepository = generateCrudRepository('goal', {
  softDelete: true,
  defaultOrderBy: 'id',
  defaultIncludes: {
    goalObjectives: {
      include: {
        objective: true
      }
    },
    mealPlans: true,
    patient: true
  }
});
