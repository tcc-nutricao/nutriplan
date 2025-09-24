import { generateCrudRepository } from './Repository.js'

export const RecipeRepository = generateCrudRepository('recipe', {
  softDelete: true,
  defaultOrderBy: 'id'
})
