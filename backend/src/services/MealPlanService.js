import { MealPlanRepository } from '../repositories/MealPlanRepository.js'

export const MealPlanService = {
  async search (filters, limit = 10, page = 1, order = 'asc') {
    return await MealPlanRepository.search(filters, limit, page, order)
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


