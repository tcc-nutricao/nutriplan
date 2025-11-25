import { generateCrudRepository } from './Repository.js'


import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const base = generateCrudRepository('mealPlan', {
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
        meal: true,
        mealPlanRecipes: {
          include: {
            recipe: {
              include: {
                recipePreferences: {
                  include: {
                    preference: true
                  }
                },
                recipeFoods: {
                  include: {
                    food: true,
                    unit_of_measurement: true,
                    preparationMethod: true
                  }
                }
              }
            }
          }
        }
      }
    }
  }
})

export const MealPlanRepository = {
  ...base,
  updateMany: async ({ where, data }) => {
    return prisma.mealPlan.updateMany({ where, data })
  }
}


