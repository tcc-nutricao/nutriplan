import { generateCrudRepository } from './Repository.js'

export const RecipeRepository = generateCrudRepository('recipe', {
  softDelete: true,
  defaultOrderBy: 'id',
  defaultIncludes: {
    recipeFoods: true,
    mealPlanRecipes: true,
    foodConsumed: true,
    recipeObjectives: {
      include: {
        objective: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    }
  }
})
