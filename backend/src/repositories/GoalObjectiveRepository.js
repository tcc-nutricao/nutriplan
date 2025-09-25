import { generateCrudRepository } from './Repository.js'

export const GoalObjectiveRepository = generateCrudRepository('goalObjective', {
  softDelete: false, 
  defaultOrderBy: 'id',
  defaultIncludes: {
    goal: true,
    objective: true
  }
})


