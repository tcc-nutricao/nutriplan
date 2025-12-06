
import { PrismaClient } from '@prisma/client';
import { generateCrudRepository } from './Repository.js';

const prisma = new PrismaClient();

const findActualByPatientId = async (patientId) => {
  return await prisma.healthData.findFirst({
    where: { id_patient: patientId },
    orderBy: [
      { record_date: 'desc' },
      { created_at: 'desc' },
      { id: 'desc' }
    ],
    include: { patient: true }
  });
};

export const HealthDataRepository = {
  ...generateCrudRepository('healthData', {
    softDelete: false,
    defaultOrderBy: 'id',
    defaultIncludes: {
      patient: true
    }
  }),
  findActualByPatientId
};
