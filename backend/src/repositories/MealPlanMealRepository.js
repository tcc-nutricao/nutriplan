import { generateCrudRepository } from './Repository.js'

export const MealPlanMealRepository = generateCrudRepository('mealPlanMeal', {
  softDelete: false, 
  defaultOrderBy: 'id',
  defaultIncludes: {
    mealPlan: true, 
    meal: true,
    foodConsumed: {
      include: {
        food: true,                
        unitOfMeasurement: true,   
        recipe: true             
      }
    },
    mealPlanRecipes: true
  }
})
