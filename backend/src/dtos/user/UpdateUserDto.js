import { z } from 'zod';

export const UpdateUserSchema = z.object({
  id: z.number({
    required_error: 'ID é obrigatório para atualização',
    invalid_type_error: 'ID deve ser um número',
  }),
  role: z.enum(['STANDARD', 'PROFESSIONAL'], {
    required_error: 'Tipo de usuário é obrigatório',
    invalid_type_error: 'Tipo de usuário inválido',
  }),
  name: z.preprocess((val) => val ?? '', z.string().min(1, 'Nome é obrigatório')),
  email: z.preprocess((val) => val ?? '', z.string().email('E-mail inválido').min(1, 'Email é obrigatório')),
  password: z.preprocess((val) => val ?? '', z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')),
  profile_picture: z
    .preprocess(
      (val) => val ?? undefined,
    z.string().transform(val => {
      if (val && val.startsWith('data:image')) {
        return val.split(',')[1];
      }
      return val; 
    }).optional()
  ),
});