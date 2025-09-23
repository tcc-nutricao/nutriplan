import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const HealthDataRepository = {
  async search({ filters = [], limit = 10, page = 1, order = 'asc' }) {
    const where = {
      deleted_at: null,
    };

    filters.forEach((filter) => {
      const { field, value, operator = 'equals' } = filter;
      if (field && value !== undefined) {
        where[field] = { [operator]: value };
      }
    });

    const total = await prisma.healthData.count({ where });

    const data = await prisma.healthData.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        id: order === 'asc' ? 'asc' : 'desc',
      },
      include: {
        patient: true
      },
    });

    return { data, total };
  },

  async create(data) {
    return await prisma.healthData.create({
      data,
    });
  },

  async update(id, data) {
    return await prisma.healthData.update({
      where: { id },
      data,
    });
  },

  async remove(id) {
    return await prisma.healthData.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  },
};
