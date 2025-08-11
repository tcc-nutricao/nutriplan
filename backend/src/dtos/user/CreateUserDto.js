import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.preprocess((val) => val ?? '', z.string().min(1, 'Nome é obrigatório')),
  email: z.preprocess((val) => val ?? '', z.string().email('E-mail inválido').min(1, 'Email é obrigatório')),
  role: z.enum(['STANDARD', 'PROFESSIONAL'], {
    required_error: 'Tipo de usuário é obrigatório',
    invalid_type_error: 'Tipo de usuário inválido',
  }),
  password: z.preprocess((val) => val ?? '', z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')),
});
