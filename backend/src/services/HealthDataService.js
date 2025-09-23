import { HealthDataRepository } from '../repositories/HealthDataRepository.js'

export const MealPlanService = {
   async search (object) {
        const { data = [], total = 0 } = await HealthDataRepository.search(object)
        return { data, total }
  },
  async insert (data) {
        try {
            return await HealthDataRepository.create({
                ...data
            })
        } catch (err) {
            console.log(err)
            throw err
        }
    },
    async update (id, data) {
        try {
            return await HealthDataRepository.update(id, data)
        } catch (err) {
            console.log(err)
            throw err
        }
    },
    async remove (id) {
        try {
            return await HealthDataRepository.remove(id)
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}


