import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const MealPlanRepository = {
  async search (object) {
    const { filters = [], limit = 10, page = 1, order = 'asc' } = object
    const where = {
      deleted_at: null
    }
    const total = await prisma.mealPlan.count({ where })
  
    const data = await prisma.mealPlan.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        id: order === 'asc' ? 'asc' : 'desc'
      }
    })
  
    return { data, total }
  },
  async create (data) {
    return await prisma.mealPlan.create({
      data,
    })
  },
  async update (id, data) {
    return await prisma.mealPlan.update({
      where: { id },
      data
    })
  },
  async remove (id) {
    return await prisma.mealPlan.delete({
      where: { id }
    })
  }
}


