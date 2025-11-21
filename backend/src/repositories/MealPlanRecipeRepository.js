import { generateCrudRepository } from './Repository.js'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const findByPatientId = async (patientId) => {
    console.log('patientId', patientId);
  return await prisma.mealPlanRecipe.findMany({
    where: {
      mealPlanMeal: {
        mealPlan: {
          id_patient: patientId,
          deleted_at: null
        },
        deleted_at: null
      },
      deleted_at: null
    },
    include: {
      recipe: {
        include: {
          recipePreferences: {
            include: {
              preference: true
            }
          }
        }
      }
    }
  })
}

export const MealPlanRecipeRepository = {
    ...generateCrudRepository('mealPlanRecipe', {
        softDelete: false,
        defaultOrderBy: 'id',
        defaultIncludes: {
            mealPlanMeal: { 
                include: { 
                    meal: true 
                } 
            }, 
            recipe: {
                include: {
                    recipePreferences: {
                        include: {
                            preference: true
                        }
                    }
                }
            }
        }
    }),
    findByPatientId
}


