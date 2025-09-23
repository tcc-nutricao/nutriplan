import { z } from 'zod';

export const CreateFoodConsumedSchema = z.object({
  id_meal_plan_meal: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: 'ID da refeição do plano é obrigatório e deve ser um número positivo' })
  ),
  id_food: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: 'ID do alimento é obrigatório e deve ser um número positivo' })
  ),
  id_recipe: z.preprocess(
    (val) => val === undefined ? undefined : Number(val),
    z.number().int().positive({ message: 'ID da receita deve ser um número positivo' }).optional()
  ),
  id_unit_of_measurement: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: 'ID da unidade de medida é obrigatório e deve ser um número positivo' })
  ),
  quantity: z.preprocess(
    (val) => Number(val),
    z.number().positive({ message: 'Quantidade deve ser um número positivo' })
  ),
  date: z.preprocess(
    (val) => val ? new Date(val) : new Date(),
    z.date()
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
