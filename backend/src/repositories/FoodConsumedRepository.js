import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const FoodConsumedRepository = {
  async search(object) {
    const { filters = {}, limit = 10, page = 1, order = 'asc' } = object

    const where = {} 

    const total = await prisma.foodConsumed.count({ where })

    const data = await prisma.foodConsumed.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { id: order },
      include: {
        mealPlanMeal: true,
        food: true,
        recipe: true,
        unitOfMeasurement: true
      }
    })

    return { data, total }
  },

  async create(data) {
    return await prisma.foodConsumed.create({
      data: {
        id_meal_plan_meal: data.mealPlanMealId,
        id_food: data.foodId,
        id_recipe: data.recipeId || null,
        id_unit_of_measurement: data.unitOfMeasurementId,
        quantity: data.quantity,
        date: data.date ? new Date(data.date) : new Date(),
        created_at: new Date()
      }
    })
  },

  async update(id, data) {
    return await prisma.foodConsumed.update({
      where: { id },
      data: {
        id_meal_plan_meal: data.mealPlanMealId,
        id_food: data.foodId,
        id_recipe: data.recipeId || null,
        id_unit_of_measurement: data.unitOfMeasurementId,
        quantity: data.quantity,
        date: data.date ? new Date(data.date) : undefined,
        updated_at: new Date()
      }
    })
  },

  async remove(id) {
    return await prisma.foodConsumed.delete({
      where: { id }
    })
  }
}
