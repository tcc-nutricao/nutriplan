import { NutritionistPatientRepository } from '../repositories/NutritionistPatientRepository.js'

export const MealPlanService = {
   async search (object) {
        const { data = [], total = 0 } = await NutritionistPatientRepository.search(object)
        return { data, total }
  },
  async insert (data) {
        try {
            return await NutritionistPatientRepository.create({
                ...data
            })
        } catch (err) {
            console.log(err)
            throw err
        }
    },
    async update (id, data) {
        try {
            return await NutritionistPatientRepository.update(id, data)
        } catch (err) {
            console.log(err)
            throw err
        }
    },
    async remove (id) {
        try {
            return await NutritionistPatientRepository.remove(id)
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}


