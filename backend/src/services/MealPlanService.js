import { MealPlanRepository } from '../repositories/MealPlanRepository.js'
import { MealPlanDietaryRestrictionRepository } from '../repositories/MealPlanDietaryRestrictionRepository.js'
import { GoalObjectiveRepository } from '../repositories/GoalObjectiveRepository.js'

export const MealPlanService = {
  async search (object) {
    const { data: mealPlan = [] } = await MealPlanRepository.search(object)

    const mealPlanIds = mealPlan.map(item => item.id)
    const goalIds = mealPlan.map(item => item.idGoal)

    let data = mealPlan.map(plan => ({
      ...plan, 
      dietaryRestrictions: [],
      goalObjectives: []
    }))

    if (mealPlanIds.length) {
      const dietaryRestrictionFilters = { column: 'idMealPlan', value: mealPlanIds }
      let goalObjective = []
      if (goalIds.length) {
        const goalObjectiveFilters = { column: 'idMealPlan', value: goalIds }

        const result = await GoalObjectiveRepository.search({ filters: goalObjectiveFilters })
        if (result.data ) goalObjective = result.data
      }
      const { data: dietaryRestriction = [] } = await MealPlanDietaryRestrictionRepository.search({ filters: dietaryRestrictionFilters })
      
      data = mealPlan.map(plan => {
        const dietaryRestrictions = dietaryRestriction.filter(restriction => restriction.id_meal_plan === plan.id)
        const goalObjectives = goalObjective.filter(goal => goal.id_goal === plan.id_goal)
        return { 
          ...plan, 
          dietaryRestrictions,
          goalObjectives
        }
      })
    }

    let total = data.length
    return { data, total }
  },
  async insert (data) {
    try {
      return await MealPlanRepository.create({
        ...data
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  async update (id, data) {
    try {
      return await MealPlanRepository.update(id, data)
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  async remove (id) {
    try {
      return await MealPlanRepository.remove(id)
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}


