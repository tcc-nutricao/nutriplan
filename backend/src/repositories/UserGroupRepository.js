
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getGroupsByUserId = async (userId) => {
	return await prisma.userGroup.findMany({
		where: {
			id_user: userId,
			deleted_at: null
		},
		include: {
			group: true
		}
	});
};

const countParticipantsByGroupId = async (groupId) => {
	return await prisma.userGroup.count({
		where: {
			id_group: groupId,
			deleted_at: null
		}
	});
};

const getParticipantNamesByGroupId = async (groupId) => {
	const userGroups = await prisma.userGroup.findMany({
		where: {
			id_group: groupId,
			deleted_at: null
		},
		include: {
			user: {
				select: {
					name: true
				}
			}
		}
	});

	return userGroups.map(ug => ug.user.name.split(' ')[0]);
};

const create = async (data) => {
	return await prisma.userGroup.create({
		data
	});
};

const findByUserAndGroup = async (userId, groupId) => {
	return await prisma.userGroup.findFirst({
		where: {
			id_user: userId,
			id_group: groupId,
			deleted_at: null
		}
	});
};

const getFirstAdminNameByGroupId = async (groupId) => {
	const adminUserGroup = await prisma.userGroup.findFirst({
		where: {
			id_group: groupId,
			role: 'ADMIN',
			deleted_at: null
		},
		include: {
			user: {
				select: {
					name: true
				}
			}
		}
	});

	return adminUserGroup ? adminUserGroup.user.name.split(' ')[0] : 'Desconhecido';
};

const remove = async (userId, groupId) => {
	return await prisma.userGroup.updateMany({
		where: {
			id_user: userId,
			id_group: groupId
		},
		data: {
			deleted_at: new Date()
		}
	});
};

const removeAllByGroupId = async (groupId) => {
	return await prisma.userGroup.deleteMany({
		where: {
			id_group: groupId
		}
	});
};

export const UserGroupRepository = {
	getGroupsByUserId,
	countParticipantsByGroupId,
	getParticipantNamesByGroupId,
	create,
	findByUserAndGroup,
	getFirstAdminNameByGroupId,
	remove,
	removeAllByGroupId
};
