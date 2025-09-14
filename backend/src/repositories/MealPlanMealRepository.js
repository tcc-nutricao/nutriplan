import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const MealPlanMealRepository = {
  async search (object) {
    const { filters = {}, limit = 10, page = 1, order = 'asc' } = object

    const where = {} 

    const total = await prisma.mealPlanMeal.count({ where })

    const data = await prisma.mealPlanMeal.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { id: order },
      include: {
        mealPlan: true, 
        meal: true,
        foodConsumed: {
          include: {
            food: true,                
            unitOfMeasurement: true,   
            recipe: true             
          }
        },
        mealPlanRecipes: true
      }
    })


    return { data, total }
  },

  async create(data) {
    return await prisma.mealPlanMeal.create({
      data: {
        id_meal_plan: data.mealPlanId, 
        id_meal: data.mealId,
        time: data.time ? new Date(`1970-01-01T${data.time}Z`) : null, 
        created_at: new Date()
      }
    })
  },

   async update(id, data) {
    return await prisma.mealPlanMeal.update({
      where: { id },
      data: {
        id_meal_plan: data.mealPlanId,
        id_meal: data.mealId,
        time: data.time ? new Date(`1970-01-01T${data.time}Z`) : undefined,
        updated_at: new Date()
      }
    })
  },

  async remove (id) {
    return await prisma.mealPlanMeal.delete({
      where: { id }
    })
  }
}
