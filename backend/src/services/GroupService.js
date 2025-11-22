import { GroupRepository } from '../repositories/GroupRepository.js'
import { UserGroupRepository } from '../repositories/UserGroupRepository.js'
import { generateCrudService } from './Service.js'
import { PatientService } from './PatientService.js'

const baseCrudService = generateCrudService(GroupRepository)

function generateRandomCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const GroupService = {
  ...baseCrudService,

  async create(data, userId) {

    let picture = undefined
    if (data.picture && typeof data.picture === 'string') {
      const base64Data = data.picture.replace(/^data:image\/\w+;base64,/, "")
      picture = Buffer.from(base64Data, 'base64')
    }

    let endDate = null
    if (data.end_date) {
      endDate = new Date(data.end_date)
      endDate.setHours(endDate.getHours() + 4)
    }

    let inviteCode
    let isUnique = false
    while (!isUnique) {
      inviteCode = generateRandomCode(6)
      const existingGroup = await GroupRepository.findByInviteCode(inviteCode)
      if (!existingGroup) {
        isUnique = true
      }
    }

    const dataWithCreator = {
      name: data.name,
      description: data.description,
      invite_code: inviteCode,
      picture: picture,
      end_date: endDate,
      created_at: new Date(),
      userGroups: {
        create: [
          {
            id_user: userId,
            role: 'ADMIN',
            created_at: new Date()
          }
        ]
      }
    }


    return GroupRepository.create(dataWithCreator)
  },

  async update(id, data) {

    const dataToUpdate = { ...data };

    if (dataToUpdate.picture && typeof dataToUpdate.picture === 'string') {
      const base64Data = dataToUpdate.picture.replace(/^data:image\/\w+;base64,/, "")
      dataToUpdate.picture = Buffer.from(base64Data, 'base64')
    }

    if (dataToUpdate.end_date) {
      const date = new Date(dataToUpdate.end_date)
      date.setHours(date.getHours() + 4)
      dataToUpdate.end_date = date
    }

    dataToUpdate.updated_at = new Date();

    delete dataToUpdate.id;

    return GroupRepository.update(id, dataToUpdate)
  },

  async getGroupsProgressByUser(userId) {
    if (!userId) {
      throw new Error('userId é obrigatório')
    }

    const userGroups = await UserGroupRepository.getGroupsByUserId(userId)

    const groupsWithDetails = await Promise.all(
      (userGroups || []).map(async (userGroup) => {
        const groupId = userGroup.id_group

        const participantCount = await UserGroupRepository.countParticipantsByGroupId(groupId)
        const participants = await UserGroupRepository.getParticipantsByGroupId(groupId)
        const ownerName = await UserGroupRepository.getFirstAdminNameByGroupId(groupId)

        const results = await Promise.all(
          participants.map(async (participant) => {
            const p = await PatientService.getProgress(participant.id_user)

            return {
              id: participant.id_user,
              name: participant.user.name,
              progress: p.metaAchieved  // porcentagem individual
            }
          })
        )

        const total = results.reduce((sum, item) => sum + item.progress, 0) / results.length

        const progress = {
          participants: results, // lista com id, nome e porcentagem individual
          total           // média geral
        }

        return {
          ...userGroup.group,
          picture: userGroup.group.picture
            ? Buffer.from(userGroup.group.picture).toString('base64')
            : null,
          participantCount,
          userRole: userGroup.role,
          ownerName,
          progress
        }
      })
    )

    return { groups: groupsWithDetails }
  },

  async joinGroup(userId, inviteCode) {
    if (!userId) {
      throw new Error('userId é obrigatório')
    }
    if (!inviteCode) {
      throw new Error('Código de convite é obrigatório')
    }

    const group = await GroupRepository.findByInviteCode(inviteCode)
    if (!group) {
      throw new Error('Grupo não encontrado com este código')
    }

    const existingUserGroup = await UserGroupRepository.findByUserAndGroup(userId, group.id)
    if (existingUserGroup) {
      throw new Error('Você já participa deste grupo')
    }

    return UserGroupRepository.create({
      id_user: userId,
      id_group: group.id,
      role: 'MEMBER',
      created_at: new Date()
    })
  },

  async leaveGroup(userId, groupId) {
    if (!userId) {
      throw new Error('userId é obrigatório')
    }
    if (!groupId) {
      throw new Error('groupId é obrigatório')
    }

    return UserGroupRepository.remove(userId, groupId)
  },

  async deleteGroup(groupId, userId) {
    if (!groupId) {
      throw new Error('groupId é obrigatório')
    }
    if (!userId) {
      throw new Error('userId é obrigatório')
    }

    const userGroup = await UserGroupRepository.findByUserAndGroup(userId, groupId)
    if (!userGroup || userGroup.role !== 'ADMIN') {
      throw new Error('Apenas administradores podem excluir o grupo')
    }

    await UserGroupRepository.removeAllByGroupId(groupId)
    return GroupRepository.remove(groupId)
  }
}