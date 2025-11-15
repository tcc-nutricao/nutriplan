import { generateCrudRepository } from './Repository.js';
import { PrismaClient } from '@prisma/client';

// Busca todos os pacientes vinculados a um nutricionista (tabela de junção NutritionistPatient)
const findByNutritionistId = async (idNutritionist) => {
  return await prisma.nutritionistPatient.findMany({
    where: {
      id_nutritionist: idNutritionist,
      deleted_at: null
    },
    include: {
      patient: {
        include: {
          user: true
        }
      },
      nutritionist: true
    }
  });
};

export const NutritionistPatientRepository = {
  ...generateCrudRepository('nutritionistPatient', {
    softDelete: true,
    defaultOrderBy: 'id',
    // Inclui por padrão o paciente com usuário; o nutricionista pode ser útil em alguns cenários.
    defaultIncludes: {
      patient: { include: { user: true } },
      nutritionist: true
    }
  }),
  findByNutritionistId
};

