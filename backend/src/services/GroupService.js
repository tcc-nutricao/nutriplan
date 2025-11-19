import { GroupRepository } from '../repositories/GroupRepository.js'
import { UserGroupRepository } from '../repositories/UserGroupRepository.js'
import { generateCrudService } from './Service.js'

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

    const groupsWithDetails = await Promise.all((userGroups || []).map(async (userGroup) => {
      const groupId = userGroup.id_group
      const participantCount = await UserGroupRepository.countParticipantsByGroupId(groupId)
      const participantNames = await UserGroupRepository.getParticipantNamesByGroupId(groupId)

      return {
        ...userGroup.group,
        picture: userGroup.group.picture
          ? Buffer.from(userGroup.group.picture).toString('base64')
          : null,
        participantCount,
        participantNames,
      }
    }))
    return {
      groups: groupsWithDetails
    }
  }
}