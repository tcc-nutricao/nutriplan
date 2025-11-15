import { generateCrudRepository } from './Repository.js'

export const RecipeRepository = generateCrudRepository('recipe', {
  softDelete: true,
  defaultOrderBy: 'id',
  defaultIncludes: {
    recipeFoods: {
      include: {
        food: true,
        unit_of_measurement: true, // Corrigido para snake_case
        preparationMethod: true
      }
    },
    recipeObjectives: {
      include: {
        objective: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        }
      }
    }
  }
})
