import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const MealRepository = {
  async search(object) {
    const { filters = {}, limit = 10, page = 1, order = 'asc' } = object

    const where = {}

    const total = await prisma.meal.count({ where })

    const data = await prisma.meal.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { id: order },
      include: {
        mealPlanMeals: { include: { mealPlan: true } }, 
        mealPreferences: true,
        foodConsumed: true
      }
    })

    return { data, total }
  },

  async create(data) {
    return await prisma.meal.create({
      data: {
        name: data.name,
        description: data.description,
        created_at: new Date(),
        updated_at: new Date()
      }
    })
  },

  async update(id, data) {
    return await prisma.meal.update({
      where: { id },
      data: { ...data, updated_at: new Date() }
    })
  },

  async remove(id) {
    return await prisma.meal.delete({
      where: { id }
    })
  }
}
