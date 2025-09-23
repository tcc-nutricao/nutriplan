import { RecipeRepository } from '../repositories/RecipeRepository.js'

export const MealPlanService = {
    async search (object) {
        const { data = [], total = 0 } = await RecipeRepository.search(object)
        return { data, total }
    },
    async insert (data) {
        try {
            return await RecipeRepository.create({
                ...data
        })
        } catch (err) {
            console.log(err)
            throw err
        }
    },
    async update (id, data) {
        try {
            return await RecipeRepository.update(id, data)
        } catch (err) {
            console.log(err)
            throw err
        }
    },
    async remove (id) {
        try {
            return await RecipeRepository.remove(id)
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}


