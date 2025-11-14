
import { z } from 'zod';

export const CreateRestrictionSchema = z.object({
  name: z.string({ required_error: 'Nome é obrigatório' }).min(1, 'Nome é obrigatório'),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
});
