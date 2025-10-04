import { z } from 'zod';

export const CreateGoalObjectiveSchema = z.object({
  id_goal: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: 'ID da meta (goal) é obrigatório e deve ser um número positivo' })
  ),
  id_objective: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: 'ID do objetivo é obrigatório e deve ser um número positivo' })
  ),
  created_at: z.preprocess(
    (val) => (val ? new Date(val) : new Date()),
    z.date()
  ),
  updated_at: z.preprocess(
    (val) => (val ? new Date(val) : new Date()),
    z.date().optional()
  ),
  deleted_at: z.preprocess(
    (val) => (val ? new Date(val) : undefined),
    z.date().optional()
  ),
});