import { z } from 'zod';

export const CreatePatientSchema = z.object({
  id_user: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: 'ID do usuário é obrigatório e deve ser um número positivo' })
  ),
  id_nutritionist: z.preprocess(
    (val) => val !== null && val !== undefined ? Number(val) : null,
    z.number().int().positive().nullable().optional()
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
    z.date().nullable().optional()
  ),
});
