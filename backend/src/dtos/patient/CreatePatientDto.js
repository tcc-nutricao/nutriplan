import { z } from 'zod';

// Enum de gênero alinhado ao schema Prisma
const GenderEnum = z.enum(['FEM', 'MASC', 'NONE']);

export const CreatePatientSchema = z.object({
  id_user: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: 'ID do usuário é obrigatório e deve ser um número positivo' })
  ),
  id_nutritionist: z.preprocess(
    (val) => (val !== null && val !== undefined && val !== '' ? Number(val) : null),
    z.number().int().positive().nullable().optional()
  ),
  birth_date: z.preprocess(
    (val) => (val ? new Date(val) : new Date()),
    z.date({ required_error: 'Data de nascimento inválida' })
  ).optional(), // pode omitir para usar default do banco
  gender: GenderEnum.default('NONE').optional(),
  height: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return 0;
      const n = Number(val);
      return isNaN(n) ? 0 : n;
    },
    z.number().nonnegative({ message: 'Altura deve ser >= 0' })
  ).optional(),
  weight: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return 0;
      const n = Number(val);
      return isNaN(n) ? 0 : n;
    },
    z.number().nonnegative({ message: 'Peso deve ser >= 0' })
  ).optional(),
  profile_picture: z
    .preprocess(
      (val) => {
        if (!val) return undefined;
        if (typeof val === 'string') {
          // espera base64 (sem validação rígida aqui)
            try { return Buffer.from(val, 'base64'); } catch { return undefined; }
        }
        return undefined;
      },
      z.instanceof(Buffer).optional()
    )
    .optional(),
  created_at: z.preprocess(
    (val) => (val ? new Date(val) : new Date()),
    z.date()
  ).optional(),
  updated_at: z.preprocess(
    (val) => (val ? new Date(val) : new Date()),
    z.date().optional()
  ),
  deleted_at: z.preprocess(
    (val) => (val ? new Date(val) : undefined),
    z.date().nullable().optional()
  )
});

export const CreatePatientDTO = (input) => CreatePatientSchema.parse(input);
