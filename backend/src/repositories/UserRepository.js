import { generateCrudRepository } from './Repository.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Método customizado para remoção com soft delete no campo correto
const remove = async (id) => {
  return await prisma.user.update({
    where: { id },   
    data: {
      deletedAt: new Date() // Campo específico do User
    }
  })
}

export const UserRepository = {
  ...generateCrudRepository('user', {
    softDelete: true,
    defaultOrderBy: 'name'
  }),
  remove // Sobrescreve o remove padrão
}


