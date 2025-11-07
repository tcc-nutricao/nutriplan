import { GroupService } from '../services/GroupService.js'
import { CreateGroupSchema } from '../dtos/group/CreateGroupDto.js'
import { generateCrudController } from './Controller.js'

import { PatientRepository } from '../repositories/PatientRepository.js'

const getGroupsProgressByUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }
    const progressData = await GroupService.getGroupsProgressByUser(userId);
    return res.status(200).json({
      success: true,
      data: progressData
    });
  } catch (error) {
    console.error('Erro ao buscar progresso dos grupos para o paciente:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
}

// Mescla CRUD padrão com métodos customizados
export const GroupController =  {
  ...generateCrudController(
    GroupService,
    CreateGroupSchema,
    'Grupo'
  ),
  getGroupsProgressByUser
}


