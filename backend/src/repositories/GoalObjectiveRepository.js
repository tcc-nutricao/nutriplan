import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const GoalObjectiveRepository = {
  async search (object) {
    const { filters = [], limit = 10, page = 1, order = 'asc' } = object
    const where = {}
    const total = await prisma.goalObjective.count({ where })
  
    const data = await prisma.goalObjective.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        id: order === 'asc' ? 'asc' : 'desc'
      },
      include: {
        goal: true,
        objective: true
      }
    })
  
    return { data, total }
  },
  async create (data) {
    return await prisma.goalObjective.create({
      data,
    })
  },
  async update (id, data) {
    return await prisma.goalObjective.update({
      where: { id },
      data
    })
  },
  async remove (id) {
    return await prisma.goalObjective.delete({
      where: { id }
    })
  }
}


