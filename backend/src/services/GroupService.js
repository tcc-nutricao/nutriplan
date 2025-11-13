import { GroupRepository } from '../repositories/GroupRepository.js'
import { UserGroupRepository } from '../repositories/UserGroupRepository.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { generateCrudService } from './Service.js'

const baseCrudService = generateCrudService(GroupRepository)

export const GroupService = {
  ...baseCrudService,

  async getGroupsProgressByUser(userId) {
    try {
      if (!userId) {
        throw new AppError({ message: 'userId é obrigatório' });
      }
      const userGroups = await UserGroupRepository.getGroupsByUserId(userId);

      const groupsWithDetails = await Promise.all((userGroups || []).map(async (userGroup) => {
        const groupId = userGroup.id_group;

        const participantCount = await UserGroupRepository.countParticipantsByGroupId(groupId);
        console.log(`[Group ID: ${groupId}] Contagem de participantes:`, participantCount);

        const participantNames = await UserGroupRepository.getParticipantNamesByGroupId(groupId);
        console.log(`[Group ID: ${groupId}] Nomes dos participantes:`, participantNames);

        return {
          ...userGroup.group, // Retorna todos os dados do grupo
          participantCount,
          participantNames,
        };
      }));
      return {
        groups: groupsWithDetails
      };
    } catch (error) {
      console.error('Erro ao buscar progresso dos grupos para o paciente:', error);
      throw error;
    }
  }
}
