import { generateCrudRepository } from './Repository.js'

export const UserRepository = generateCrudRepository('user', {
  softDelete: true,
  defaultOrderBy: 'name',
  softDeleteField: 'deletedAt' 
})


