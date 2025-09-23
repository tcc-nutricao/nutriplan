import { z } from 'zod';

export const CreateRecipeSchema = z.object({
  name: z.string({
    required_error: 'Nome da receita é obrigatório',
    invalid_type_error: 'Nome da receita deve ser uma string',
  }),
  description: z.preprocess(
    (val) => val ?? undefined,
    z.string().optional()
  ),
  calories: z.preprocess(
    (val) => Number(val),
    z.number().positive({ message: 'Calorias devem ser um número positivo' })
  ),
  created_at: z.preprocess(
    (val) => val ? new Date(val) : new Date(),
    z.date()
  ),
  deleted_at: z.preprocess(
    (val) => val ? new Date(val) : undefined,
    z.date().optional()
  ),
  updated_at: z.preprocess(
    (val) => val ? new Date(val) : new Date(),
    z.date()
  ),
});
