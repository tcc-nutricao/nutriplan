import { generateCrudRepository } from './Repository.js'

export const MealPlanDietaryRestrictionRepository = generateCrudRepository('mealPlanDietaryRestriction', {
  softDelete: false, 
  defaultOrderBy: 'id',
  defaultIncludes: {
    dietaryRestriction: true
  }
})


