
import Joi from 'joi';

export const CreateUserGroupSchema = Joi.object({
	id_user: Joi.number().integer().required(),
	id_group: Joi.number().integer().required(),
	role: Joi.string().valid('ADMIN', 'MEMBER', 'GUEST').required(),
	created_at: Joi.date().optional(),
	deleted_at: Joi.date().optional().allow(null),
	updated_at: Joi.date().optional().allow(null)
});
