import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const PatientRepository = {
  async search(object, tx = prisma) {
    const { filters = {}, limit = 10, page = 1, order = 'asc' } = object

    const where = { deleted_at: null }

    const total = await tx.patient.count({ where })

    const data = await tx.patient.findMany({
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
    
    return await tx.patient.create({
      data,
    })
  },

  async update(id, data) {
    return await tx.patient.update({
      where: { id },
      data
    })
  },

  async remove(id) {
    return await tx.patient.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    })
  },

  // Buscar paciente pelo id_user
  async findByUserId(idUser) {
    return await tx.patient.findUnique({
      where: { idUser: idUser }
    })
  },

  // Buscar pacientes de um nutricionista específico
  async findByNutritionistId(idNutritionist) {
    return await tx.patient.findMany({
      where: {
        idNutritionist: idNutritionist,
        deletedAt: null
      }
    })
  }
}
