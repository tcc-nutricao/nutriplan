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
      id_nutritionist: idNutritionist,
      deleted_at: null
    },
    include: {
      user: true,
      goals: {
        where: { status: 'ACTIVE' },
        include: {
          goalObjectives: {
            include: { objective: true }
          }
        }
      },
      healthData: {
        where: { deleted_at: null },
        orderBy: { record_date: 'desc' }
      },
      patientDietaryRestrictions: {
        include: { dietaryRestriction: true }
      },
      mealPlanPatients: {
        include: {
          mealPlan: {
            include: {
              goal: {
                 include: {
                    goalObjectives: {
                        include: { objective: true }
                    }
                 }
              },
              mealPlanDietaryRestrictions: {
                include: { dietaryRestriction: true }
              }
            }
          }
        }
      }
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
