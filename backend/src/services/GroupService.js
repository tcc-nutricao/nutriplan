import { GroupRepository } from '../repositories/GroupRepository.js'
import { UserGroupRepository } from '../repositories/UserGroupRepository.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { generateCrudService } from './Service.js'

const baseCrudService = generateCrudService(GroupRepository)

export const GroupService = {
  ...baseCrudService,
  // Adicione métodos específicos do serviço de grupo aqui, se necessário

  async getGroupsProgressByUser(userId) {
    try {
      if (!userId) {
        throw new AppError('userId é obrigatório');
      }
      const groups = await UserGroupRepository.getGroupsByUserId(userId);
      let allMetaAchieved = [];
      const groupsWithProgress = await Promise.all((groups || []).map(async (group) => {
        // Supondo que group.userGroups é um array de participantes do grupo
        const participants = await Promise.all((group.userGroups || []).map(async (participant) => {
          // Busca progresso do paciente
          const progress = await PatientRepository.getProgress(participant.id_patient);
          // Só pega os campos necessários
          const metaAchieved = progress?.metaAchieved ?? null;
          const objective = progress?.objective ?? null;
          if (metaAchieved !== null && !isNaN(metaAchieved)) {
            allMetaAchieved.push(metaAchieved);
          }
          return {
            ...participant,
            metaAchieved,
            objective
          };
        }));
        // Calcula média do grupo
        const groupMetaAchieved = participants.length > 0 ? (participants.reduce((acc, p) => acc + (p.metaAchieved || 0), 0) / participants.length) : null;
        return {
          id: group.id,
          name: group.name,
          participants,
          groupMetaAchieved
        };
      }));
      return {
        groups: groupsWithProgress
      };
    } catch (error) {
      console.error('Erro ao buscar progresso dos grupos para o paciente:', error);
      throw error;
    }
  }
}



