import { z } from 'zod';

export const CreateRecipeSchema = z.object({
  name: z.string({
    required_error: 'Nome da receita é obrigatório',
    invalid_type_error: 'Nome da receita deve ser uma string',
  }),
  preparation_method: z.string({
    required_error: 'Modo de preparo é obrigatório',
    invalid_type_error: 'Modo de preparo deve ser uma string',
  }).optional(),
  preparation_time: z.preprocess(
    (val) => Number(val),
    z.number()
      .int({ message: 'Tempo de preparo deve ser um número inteiro' })
      .nonnegative({ message: 'Tempo de preparo deve ser maior ou igual a zero' })
  ),
  portion: z.preprocess(
    (val) => Number(val),
    z.number()
      .int({ message: 'Porções devem ser um número inteiro' })
      .positive({ message: 'Porções devem ser um número inteiro positivo' })
  ),
  recipeFoods: z.array(
    z.object({
      id_food: z.number({
        required_error: 'ID do alimento é obrigatório',
        invalid_type_error: 'ID do alimento deve ser um número',
      }).int().positive(),
      id_unit_of_measurement: z.number({
        required_error: 'ID da unidade de medida é obrigatório',
        invalid_type_error: 'ID da unidade de medida deve ser um número',
      }).int().positive(),
      quantity: z.number({
        required_error: 'Quantidade é obrigatória',
        invalid_type_error: 'Quantidade deve ser um número',
      }).positive({ message: 'Quantidade deve ser um número positivo' }),
      id_preparation_method: z.number().int().positive().optional(),
    })
  ).min(1, { message: 'Pelo menos um ingrediente é obrigatório' }),
  recipePreferences: z.array(
    z.object({
      id_preference: z.number({
        required_error: 'ID da preferência é obrigatório',
        invalid_type_error: 'ID da preferência deve ser um número',
      }).int().positive(),
    })
  ).optional(),
  created_at: z.preprocess(
    (val) => val ? new Date(val) : new Date(),
    z.date()
  ).optional(),
  deleted_at: z.preprocess(
    (val) => val ? new Date(val) : undefined,
    z.date().optional()
  ).optional(),
  updated_at: z.preprocess(
    (val) => val ? new Date(val) : new Date(),
    z.date()
  ).optional(),
});
