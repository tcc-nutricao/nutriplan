import { generateCrudRepository } from './Repository.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const findProfilePictureByUserId = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      profile_picture: true
    }
  })
}

const updateProfilePicture = async (id, data) => {
  return await prisma[modelName].update({
    where: { id },
    data: {
      ...data,
      updated_at: new Date(),
    },
  });
}

export const UserRepository = { 
  ...generateCrudRepository('user', {
    softDelete: true,
    defaultOrderBy: 'name',
    softDeleteField: 'deletedAt' 
  }),
  findProfilePictureByUserId,
  updateProfilePicture
}