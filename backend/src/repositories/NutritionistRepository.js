import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const NutritionistRepository = {
  async search(object, tx = prisma) {
    const { filters = {}, limit = 10, page = 1, order = 'asc' } = object

    const where = { deleted_at: null }

    const total = await tx.nutritionist.count({ where })

    const data = await tx.nutritionist.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        id: order === 'asc' ? 'asc' : 'desc'
      }
    })

    return { data, total }
  },

  async create(data, tx) {
    if (!data.created_at) {
        data.created_at = new Date()
    }
    
    return await tx.nutritionist.create({
      data,
    })
  },

  async update(id, data) {
    return await tx.nutritionist.update({
      where: { id },
      data
    })
  },

  async remove(id) {
    return await tx.nutritionist.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    })
  },

  // Buscar nutricionista pelo id_user
  async findByUserId(idUser) {
    return await tx.nutritionist.findUnique({
      where: { idUser: idUser }
    })
  }
}
