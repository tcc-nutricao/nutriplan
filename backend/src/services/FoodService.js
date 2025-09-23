import { FoodRepository } from '../repositories/FoodRepository.js'

export const MealPlanService = {
    async search (object) {
        const { data = [], total = 0 } = await UserRepository.search(object)
        return { data, total }
    },
    async insert (data) {
        try {
            return await FoodRepository.create({
                ...data
            })
        } catch (err) {
            console.log(err)
            throw err
        }
    },
    async update (id, data) {
        try {
            return await FoodRepository.update(id, data)
        } catch (err) {
            console.log(err)
            throw err
        }
    },
    async remove (id) {
        try {
            return await FoodRepository.remove(id)
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}


