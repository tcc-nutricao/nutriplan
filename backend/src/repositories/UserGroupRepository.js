
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

export const UserGroupRepository = {
	getGroupsByUserId
};
