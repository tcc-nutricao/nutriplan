
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

export const UserGroupRepository = {
	getGroupsByUserId,
	countParticipantsByGroupId,
	getParticipantNamesByGroupId
};
