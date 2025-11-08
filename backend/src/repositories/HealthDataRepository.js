
import { PrismaClient } from '@prisma/client';
import { generateCrudRepository } from './Repository.js';

const prisma = new PrismaClient();

const findActualByPatientId = async (patientId) => {
  return await prisma.healthData.findFirst({
    where: { patientId },
    orderBy: { record_date: 'desc' },
    include: { patient: true }
  });
};

export const HealthDataRepository = {
  ...generateCrudRepository('healthData', {
    softDelete: true,
    defaultOrderBy: 'id',
    defaultIncludes: {
      patient: true
    }
  }),
  findActualByPatientId
};
