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
      const groups = await UserGroupRepository.getGroupsByUserId(userId);
      let allMetaAchieved = [];
      const groupsWithProgress = await Promise.all((groups || []).map(async (group) => {
        const participants = await Promise.all((group.userGroups || []).map(async (participant) => {
          const progress = await PatientRepository.getProgress(participant.id_patient);
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
        const groupMetaAchieved = participants.length > 0 ? (participants.reduce((acc, p) => acc + (p.metaAchieved || 0), 0) / participants.length) : null;
        return {
          id: group.group.id,
          name: group.group.name,
          start_date: group.group.start_date,
          end_date: group.group.end_date,
          invite_code: group.group.invite_code,
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
