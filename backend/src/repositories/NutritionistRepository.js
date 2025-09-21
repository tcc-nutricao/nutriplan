import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const NutritionistRepository = {
  async search(object) {
    const { filters = {}, limit = 10, page = 1, order = 'asc' } = object

    const where = { deleted_at: null }

    const total = await prisma.nutritionist.count({ where })

    const data = await prisma.nutritionist.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        id: order === 'asc' ? 'asc' : 'desc'
      }
    })

    return { data, total }
  },

  async create(data) {
    if (!data.created_at) {
        data.created_at = new Date()
    }
    
    return await prisma.nutritionist.create({
      data,
    })
  },

  async update(id, data) {
    return await prisma.nutritionist.update({
      where: { id },
      data
    })
  },

  async remove(id) {
    return await prisma.nutritionist.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    })
  },

  // Buscar nutricionista pelo id_user
  async findByUserId(idUser) {
    return await prisma.nutritionist.findUnique({
      where: { idUser: idUser }
    })
  }
}
