import { generateCrudRepository } from './Repository.js'

export const MealPlanRepository = generateCrudRepository('mealPlan', {
  softDelete: false, // MealPlan usa hard delete
  defaultOrderBy: 'id',
  defaultIncludes: {
    goal: {
      include: {
        goalObjectives: {
          include: {
            objective: true
          }
        }
      }
    },
    patient: true,
    nutricionist: true,
    mealPlanDietaryRestrictions: {
      include: {
        dietaryRestriction: true
      }
    },
    mealPlanMeals: {
      include: {
        meal: true
      }
    }
  }
})


