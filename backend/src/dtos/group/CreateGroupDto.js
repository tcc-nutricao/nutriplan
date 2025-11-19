import { z } from 'zod';

export const CreateGroupSchema = z.object({
  name: z.string({
    required_error: 'Nome do grupo é obrigatório',
    invalid_type_error: 'Nome do grupo deve ser uma string',
  }),
  description: z.preprocess(
    (val) => val ?? undefined,
    z.string().optional()
  ),
  
  invite_code: z.string().optional(),
  
  picture: z.string().optional(),

  end_date: z.union([z.string(), z.date()]).optional(),
  
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