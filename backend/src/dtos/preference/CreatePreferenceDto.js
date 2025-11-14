
import { z } from 'zod';

export const CreatePreferenceSchema = z.object({
  name: z.string({ required_error: 'Nome é obrigatório' }).min(1, 'Nome é obrigatório'),
  icon: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});
