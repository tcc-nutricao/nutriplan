import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

export const MealPlanRepository = {
  async search (filters, limit, page, order) {
    const where = {}
    const total = await prisma.user.count({ where })
  
    const data = await prisma.user.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        name: order === 'asc' ? 'asc' : 'desc'
      }
    })
  
    return { data, total }
  },
  async create (data) {
    return await prisma.user.create({
      data,
    })
  },
  async update (id, data) {
    return await prisma.user.update({
      where: { id },
      data
    })
  },
  async remove (id) {
    return await prisma.user.delete({
      where: { id }
    })
  }
}


