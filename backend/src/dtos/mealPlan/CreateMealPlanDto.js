import { z } from 'zod';

export const CreateMealPlanSchema = z.object({
  id_patient: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: 'ID do paciente é obrigatório e deve ser um número positivo' })
  ),
  id_nutritionist: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: 'ID do nutricionista é obrigatório e deve ser um número positivo' })
  ),
  id_goal: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: 'ID do objetivo é obrigatório e deve ser um número positivo' })
  ),
  calories: z.preprocess(
    (val) => val === undefined ? undefined : Number(val),
    z.number().positive({ message: 'Calorias devem ser um número positivo' }).optional()
  ),
  status: z.enum(['PENDING', 'ACTIVE', 'COMPLETED'], {
    required_error: 'Status é obrigatório',
    invalid_type_error: 'Status inválido',
  }),
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
