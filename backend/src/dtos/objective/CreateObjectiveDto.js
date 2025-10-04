import { z } from 'zod';

export const CreateObjectiveSchema = z.object({
	name: z.string({
		required_error: 'Nome do objetivo é obrigatório',
		invalid_type_error: 'Nome do objetivo deve ser uma string',
	}).min(1, { message: 'Nome do objetivo não pode ser vazio' }),
	icon: z.string().optional().nullable(),
	description: z.string().optional().nullable(),
	created_at: z.preprocess(
		(val) => (val ? new Date(val) : new Date()),
		z.date()
	),
	deleted_at: z.preprocess(
		(val) => (val ? new Date(val) : undefined),
		z.date().optional()
	),
	updated_at: z.preprocess(
		(val) => (val ? new Date(val) : new Date()),
		z.date()
	),
});
