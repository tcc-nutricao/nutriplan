import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const MealPlanDietaryRestrictionRepository = {
  async search (object) {
    const { filters = [], limit = 10, page = 1, order = 'asc' } = object
    const where = {}
    const total = await prisma.mealPlanDietaryRestriction.count({ where })
  
    const data = await prisma.mealPlanDietaryRestriction.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        id: order === 'asc' ? 'asc' : 'desc'
      },
      include: {
        dietaryRestriction: true
      }
    })
  
    return { data, total }
  },
  async create (data) {
    return await prisma.mealPlanDietaryRestriction.create({
      data,
    })
  },
  async update (id, data) {
    return await prisma.mealPlanDietaryRestriction.update({
      where: { id },
      data
    })
  },
  async remove (id) {
    return await prisma.mealPlanDietaryRestriction.delete({
      where: { id }
    })
  }
}


