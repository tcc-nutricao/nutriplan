import { z } from 'zod';

export const CreateMealPlanSchema = z.object({
  id_patient: z.preprocess(
    (val) => val === undefined || val === null ? undefined : Number(val),
    z.number().int().positive().optional()
  ),
  id_nutritionist: z.preprocess(
    (val) => val === undefined || val === null ? undefined : Number(val),
    z.number().int().positive().optional()
  ),
  id_goal: z.preprocess(
    (val) => val === undefined || val === null ? undefined : Number(val),
    z.number().int().positive().optional()
  ),
  calories: z.preprocess(
    (val) => val === undefined ? undefined : Number(val),
    z.number().positive({ message: 'Calorias devem ser um número positivo' }).optional()
  ),
  status: z.enum(['PENDING', 'ACTIVE', 'COMPLETED']).optional(),
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
