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
  invite_code: z.string({
    required_error: 'Código de convite é obrigatório',
    invalid_type_error: 'Código de convite deve ser uma string',
  }),
  picture: z.preprocess(
    (val) => val ?? undefined,
    z.string().transform(val => {
      if (val && val.startsWith('data:image')) {
        return val.split(',')[1];
      }
      return val; 
    }).optional()
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
