import { z } from 'zod';

export const CreateNutritionistSchema = z.object({
  id_user: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: 'ID do usuário é obrigatório e deve ser um número positivo' })
  ),
  professional_register: z.string().min(1, { message: 'Registro profissional é obrigatório' }),
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
