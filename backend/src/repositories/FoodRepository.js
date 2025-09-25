import { generateCrudRepository } from './Repository.js'

export const FoodRepository = generateCrudRepository('food', {
  softDelete: true,
  defaultOrderBy: 'id'
})
