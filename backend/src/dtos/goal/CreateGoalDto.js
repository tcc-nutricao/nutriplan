import { z } from 'zod';

export const CreateGoalSchema = z.object({
  id_patient: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: 'ID do paciente é obrigatório e deve ser um número positivo' })
  ),
  description: z.string().optional().nullable(),
  start_date: z.string().transform((val) => {
    // Se já tem formato ISO completo, usa como está
    if (val.includes('T') && val.includes('Z')) return new Date(val);
    // Se tem apenas T mas sem Z, adiciona Z
    if (val.includes('T')) return new Date(val + 'Z');
    // Se é apenas data (YYYY-MM-DD), adiciona horário
    if (val.match(/^\d{4}-\d{2}-\d{2}$/)) return new Date(val + 'T00:00:00.000Z');
    // Tenta converter qualquer outro formato
    return new Date(val);
  }),
  end_date: z.string().transform((val) => {
    // Se já tem formato ISO completo, usa como está
    if (val.includes('T') && val.includes('Z')) return new Date(val);
    // Se tem apenas T mas sem Z, adiciona Z
    if (val.includes('T')) return new Date(val + 'Z');
    // Se é apenas data (YYYY-MM-DD), adiciona horário de fim do dia
    if (val.match(/^\d{4}-\d{2}-\d{2}$/)) return new Date(val + 'T23:59:59.999Z');
    // Tenta converter qualquer outro formato
    return new Date(val);
  }).optional().nullable(),
  status: z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELED'], { 
    required_error: 'Status da meta é obrigatório'
  }),
});
