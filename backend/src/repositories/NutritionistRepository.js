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

const updateInviteCode = async (id, code, expiresAt) => {
  return await prisma.nutritionist.update({
    where: { id: id },
    data: {
      invite_code: code,
      invite_code_expires_at: expiresAt
    }
  });
};

const findByInviteCode = async (code) => {
  return await prisma.nutritionist.findUnique({
    where: { invite_code: code },
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
  findById,
  updateInviteCode,
  findByInviteCode
}
