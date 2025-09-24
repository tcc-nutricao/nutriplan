import { generateCrudRepository } from './Repository.js'

export const GroupRepository = generateCrudRepository('group', {
  softDelete: true,
  defaultOrderBy: 'id',
  defaultIncludes: {
    userGroups: true
  }
})
