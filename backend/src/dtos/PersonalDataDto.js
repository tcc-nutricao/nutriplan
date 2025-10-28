import { z } from 'zod'

export const createPersonalDataSchema = z.object({
  birth_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data de nascimento deve ser uma data válida'
  }),
  gender: z.enum(['FEM', 'MASC', 'NONE'], {
    errorMap: () => ({ message: 'Gênero deve ser FEM, MASC ou NONE' })
  }),
  height: z.number().min(50).max(250, {
    message: 'Altura deve estar entre 50 e 250 cm'
  }),
  weight: z.number().min(20).max(500, {
    message: 'Peso deve estar entre 20 e 500 kg'
  }),
  restrictions: z.array(z.number().int().positive()).optional().default([]),
  objectives: z.array(z.number().int().positive()).min(1, {
    message: 'Pelo menos um objetivo deve ser selecionado'
  }),
  preferences: z.array(z.number().int().positive()).optional().default([])
})

export const validatePersonalData = (data) => {
  return createPersonalDataSchema.parse(data)
}