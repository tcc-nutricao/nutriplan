import { generateCrudRepository } from './Repository.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const findByUserId = async (idUser) => {
  return await prisma.nutritionist.findUnique({
    where: { idUser: idUser }
  })
}

export const NutritionistRepository = {
  ...generateCrudRepository('nutritionist', {
    softDelete: true,
    defaultOrderBy: 'id'
  }),
  findByUserId
}
