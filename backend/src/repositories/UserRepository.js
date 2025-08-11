import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export class UserRepository {
  static async search(filters, limit, page, order) {
    const where = {};

    if (filters.name) {
      where.name = { contains: filters.name, mode: 'insensitive' };
    }
    if (filters.email) {
      where.email = { contains: filters.email, mode: 'insensitive' };
    }

    const total = await prisma.user.count({ where });

    const data = await prisma.user.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        name: order === 'asc' ? 'asc' : 'desc',
      },
    });

    return { data, total };
  }

  static async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  static async create(data) {
    return await prisma.user.create({
      data,
    });
  }

  static async update(id, data) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  static async remove(id) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}
