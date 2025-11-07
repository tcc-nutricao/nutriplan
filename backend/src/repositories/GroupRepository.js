import { generateCrudRepository } from './Repository.js'

export const GroupRepository = generateCrudRepository('group', {
  softDelete: false, 
  defaultOrderBy: 'id',
  include: { 
    userGroups: true 
  } 
})
