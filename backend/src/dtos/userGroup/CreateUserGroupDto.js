import { z } from 'zod';

export const CreateUserGroupSchema = z.object({
  id_user: z.number({
    required_error: 'ID do usuário é obrigatório',
    invalid_type_error: 'ID do usuário deve ser um número',
  }),
  id_group: z.number({
    required_error: 'ID do grupo é obrigatório',
    invalid_type_error: 'ID do grupo deve ser um número',
  }),
  role: z.enum(['ADMIN', 'MEMBER', 'GUEST'], {
    required_error: 'Cargo é obrigatório',
    invalid_type_error: 'Cargo deve ser um dos seguintes valores: ADMIN, MEMBER, GUEST',
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