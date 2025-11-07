import { generateCrudRepository } from './Repository.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


const findByUserId = async (idUser) => {
  return await prisma.nutritionist.findUnique({
    where: { id_user: idUser },
    include: {
      user: true
    }
  });
};

const findById = async (id) => {
  return await prisma.nutritionist.findUnique({
    where: { id: id },
    include: {
      user: true
    }
  });
};

export const NutritionistRepository = {
  ...generateCrudRepository('nutritionist', {
    softDelete: true,
    defaultOrderBy: 'id'
  }),
  findByUserId,
  findById
}
