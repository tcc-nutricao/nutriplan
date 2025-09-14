import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const UserRepository = {
  async search (object) {
    const { filters = [], limit = 10, page = 1, order = 'asc' } = object
    const where = {}
  
    if (filters.name) {
      where.name = { contains: filters.name, mode: 'insensitive' }
    }
    if (filters.email) {
      where.email = { contains: filters.email, mode: 'insensitive' }
    }
  
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
  async findByEmail (email) {
    return await prisma.user.findUnique({
      where: { email }
    })
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


