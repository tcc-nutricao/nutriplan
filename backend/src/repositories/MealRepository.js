import { generateCrudRepository } from './Repository.js'

export const MealRepository = generateCrudRepository('meal', {
  softDelete: false, 
  defaultOrderBy: 'id',
  defaultIncludes: {
    mealPlanMeals: { 
      include: { 
        mealPlan: true 
      } 
    }, 
    mealPreferences: true
  }
})
