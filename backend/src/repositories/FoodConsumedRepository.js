import { generateCrudRepository } from './Repository.js'

export const FoodConsumedRepository = generateCrudRepository('foodConsumed', {
  softDelete: false,
  defaultOrderBy: 'id',
  defaultIncludes: {
    mealPlanMeal: true,
    food: true,
    recipe: true,
    unitOfMeasurement: true
  }
})
