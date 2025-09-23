import { z } from 'zod';

export const CreateNutritionistPatientSchema = z.object({
  id_nutritionist: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: 'ID do nutricionista é obrigatório e deve ser um número positivo' })
  ),
  id_patient: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: 'ID do paciente é obrigatório e deve ser um número positivo' })
  ),
  created_at: z.preprocess(
    (val) => val ? new Date(val) : new Date(),
    z.date()
  ),
  updated_at: z.preprocess(
    (val) => val ? new Date(val) : new Date(),
    z.date().optional()
  ),
  deleted_at: z.preprocess(
    (val) => val ? new Date(val) : undefined,
    z.date().optional()
  ),
});
