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
  preparation_time: z.preprocess(
    (val) => Number(val),
    z.number()
      .int({ message: 'Tempo de preparo deve ser um número inteiro' })
      .nonnegative({ message: 'Tempo de preparo deve ser maior ou igual a zero' })
  ),
  portion: z.preprocess(
    (val) => Number(val),
    z.number()
      .int({ message: 'Porção deve ser um número inteiro' })
      .positive({ message: 'Porção deve ser um número inteiro positivo' })
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
