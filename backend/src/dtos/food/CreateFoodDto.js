import { z } from 'zod';

export const CreateFoodSchema = z.object({
  name: z.string({
    required_error: 'Nome do alimento é obrigatório',
    invalid_type_error: 'Nome do alimento deve ser uma string',
  }),
  calories: z.preprocess(
    (val) => Number(val),
    z.number().positive({ message: 'Calorias devem ser um número positivo' })
  ),
  protein: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative({ message: 'Proteínas devem ser um número não negativo' })
  ),
  carbs: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative({ message: 'Carboidratos devem ser um número não negativo' })
  ),
  fat: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative({ message: 'Gordura deve ser um número não negativo' })
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
