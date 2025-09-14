import { MealPlanRepository } from '../repositories/MealPlanRepository.js'
import { MealPlanDietaryRestrictionRepository } from '../repositories/MealPlanDietaryRestrictionRepository.js'
import { MealPlanMealRepository } from '../repositories/MealPlanMealRepository.js'
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
      const mealPlanFilters = { column: 'idMealPlan', value: mealPlanIds }

      let goalObjective = []

      if (goalIds.length) {
        const goalObjectiveFilters = { column: 'idMealPlan', value: goalIds }

        const result = await GoalObjectiveRepository.search({ filters: goalObjectiveFilters })
        if (result.data ) goalObjective = result.data
      }

      const { data: mealPlanMeal = [] } = await MealPlanMealRepository.search({ filters: mealPlanFilters })
      const { data: dietaryRestriction = [] } = await MealPlanDietaryRestrictionRepository.search({ filters: mealPlanFilters })
      data = mealPlan.map(plan => {
        const goalObjectives = goalObjective.filter(goal => goal.id_goal === plan.id_goal)
        const dietaryRestrictions = dietaryRestriction.filter(restriction => restriction.id_meal_plan === plan.id)
        const mealPlanMeals = mealPlanMeal.filter(meal => meal.id_meal_plan === plan.id)
        return { 
          ...plan, 
          goalObjectives,
          dietaryRestrictions,
          mealPlanMeals
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


