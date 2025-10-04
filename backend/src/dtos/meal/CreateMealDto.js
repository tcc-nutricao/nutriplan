import { z } from 'zod';

export const CreateMealSchema = z.object({
  name: z.string({
    required_error: 'Nome da refeição é obrigatório',
    invalid_type_error: 'Nome deve ser string'
  }).min(1, { message: 'Nome não pode ser vazio' }),
  description: z.string().optional().nullable(),
  created_at: z.preprocess((val) => (val ? new Date(val) : new Date()), z.date()),
  deleted_at: z.preprocess((val) => (val ? new Date(val) : undefined), z.date().optional()),
  updated_at: z.preprocess((val) => (val ? new Date(val) : new Date()), z.date())
});

export const createMealValidate = (data) => CreateMealSchema.parse(data);
