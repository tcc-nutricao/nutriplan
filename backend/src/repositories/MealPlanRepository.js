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
        foodConsumed: {
          include: {
            food: true,
            recipe: true,
            unitOfMeasurement: true
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


