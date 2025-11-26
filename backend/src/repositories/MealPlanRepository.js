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
    mealPlanPatients: {
      include: {
        patient: true
      }
    },
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
  
  create: async (data) => {
    const { id_patient, ...mealPlanData } = data;
    
    return prisma.$transaction(async (tx) => {
      const mealPlan = await tx.mealPlan.create({
        data: {
          ...mealPlanData,
          created_at: new Date(),
        }
      });

      if (id_patient) {
        await tx.mealPlanPatient.create({
          data: {
            id_meal_plan: mealPlan.id,
            id_patient: id_patient,
            created_at: new Date()
          }
        });
      }

      return mealPlan;
    });
  },

  updateMany: async ({ where, data }) => {
    return prisma.mealPlan.updateMany({ where, data })
  }
}


