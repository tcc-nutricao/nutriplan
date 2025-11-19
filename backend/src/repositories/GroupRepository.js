import { generateCrudRepository } from './Repository.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const GroupRepository = {
  ...generateCrudRepository('group', {
    softDelete: false,
    defaultOrderBy: 'id',
    include: {
      userGroups: true
    }
  }),

  async findByInviteCode(code) {
    return await prisma.group.findFirst({
      where: {
        invite_code: code
      }
    })
  }
}