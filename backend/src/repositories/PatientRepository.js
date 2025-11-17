import { generateCrudRepository } from './Repository.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const findByUserId = async (idUser) => {
  return await prisma.patient.findUnique({
    where: { id_user: idUser },
	  include: { user: true }
  });
};

const findByNutritionistId = async (idNutritionist) => {
  return await prisma.patient.findMany({
    where: {
      idNutritionist: idNutritionist,
      deleted_at: null
    }
  });
};

const findById = async (id) => {
  return await prisma.patient.findUnique({
    where: { id: id },
    include: {
      user: true
    }
  });
};

export const PatientRepository = {
  ...generateCrudRepository('patient', {
    softDelete: true,
    defaultOrderBy: 'id'
  }),
  findByUserId,
  findByNutritionistId,
  findById
};
