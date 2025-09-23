import { FoodConsumedRepository } from '../repositories/FoodConsumedRepository.js'

export const FoodConsumedService = {
    async search (object) {
        const { data = [], total = 0 } = await FoodConsumedRepository.search(object)
        return { data, total }
    },
    async insert (data) {
        try {
            return await FoodConsumedRepository.create({
            ...data
        })
        } catch (err) {
            console.log(err)
            throw err
        }
    },
    async update (id, data) {
        try {
            return await FoodConsumedRepository.update(id, data)
        } catch (err) {
            console.log(err)
            throw err
        }
    },
    async remove (id) {
        try {
            return await FoodConsumedRepository.remove(id)
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}


