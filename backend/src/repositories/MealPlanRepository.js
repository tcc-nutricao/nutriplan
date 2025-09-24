import { generateCrudRepository } from './Repository.js'

export const MealPlanRepository = generateCrudRepository('mealPlan', {
  softDelete: false, // MealPlan usa hard delete
  defaultOrderBy: 'id'
})


