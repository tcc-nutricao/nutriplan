import { generateCrudRepository } from "./Repository.js";

export const PatientRepository = generateCrudRepository("patient", {
  softDelete: true,
  defaultOrderBy: "id",
  customMethods: {

    findByUserId: async (prisma, idUser) => {
      return await prisma.patient.findUnique({
        where: { id_user: idUser },
      });
    },
    findByNutritionistId: async (prisma, idNutritionist) => {
      return await prisma.patient.findMany({
        where: {
          idNutritionist: idNutritionist,
          deleted_at: null,
        },
      });
    },
  },
});
