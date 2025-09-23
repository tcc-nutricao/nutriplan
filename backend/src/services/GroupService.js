import { GroupRepository } from '../repositories/GroupRepository.js'

export const MealPlanService = {
    async search (object) {
        const { data = [], total = 0 } = await GroupRepository.search(object)
        return { data, total }
    },
    async insert (data) {
        try {
            return await GroupRepository.create({
                ...data
        })
        } catch (err) {
            console.log(err)
            throw err
        }
    },
    async update (id, data) {
        try {
            return await GroupRepository.update(id, data)
        } catch (err) {
            console.log(err)
            throw err
        }
    },
    async remove (id) {
        try {
            return await GroupRepository.remove(id)
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}


