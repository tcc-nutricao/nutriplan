import { GroupService } from '../services/GroupService.js'
import { CreateGroupSchema } from '../dtos/group/CreateGroupDto.js'
import { UpdateGroupSchema } from '../dtos/group/UpdateGroupDto.js'
import { generateCrudController } from './Controller.js'
import { PatientRepository } from '../repositories/PatientRepository.js'

const createGroupWithUser = async (req, res) => {
  console.log('-------------------------------------------------')
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Usuário não autenticado' })
    }

    const newGroup = await GroupService.create(req.body, userId)

    console.log('✅ Grupo criado com sucesso!')
    return res.status(201).json(newGroup)
  } catch (error) {
    console.error('❌ Erro no Controller:', error)
    return res.status(400).json({
      success: false,
      message: error.message || 'Erro ao criar grupo'
    })
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateGroupSchema.parse(req.body);

    const updatedGroup = await GroupService.update(Number(id), validatedData);

    return res.status(200).json(updatedGroup);
  } catch (error) {
    console.error('❌ Erro no Update:', error);
    if (error.issues) {
      return res.status(400).json({ success: false, errors: error.issues });
    }
    return res.status(400).json({ success: false, message: error.message });
  }
}

const getGroupsProgressByUser = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      })
    }
    const progressData = await GroupService.getGroupsProgressByUser(userId)
    return res.status(200).json({
      success: true,
      data: progressData
    })
  } catch (error) {
    console.error('Erro ao buscar progresso dos grupos para o paciente:', error)
    return res.status(500).json({
      success: false,
      field: error.field || null,
      message: error.message || 'Erro interno do servidor'
    })
  }
}

export const GroupController = {
  ...generateCrudController(
    GroupService,
    CreateGroupSchema,
    'Grupo'
  ),
  createGroupWithUser,
  update,
  getGroupsProgressByUser,
  async joinGroup(req, res) {
    try {
      const userId = req.user.id
      const { inviteCode } = req.body
      const result = await GroupService.joinGroup(userId, inviteCode)
      res.json({
        status: 'success',
        data: result
      })
    } catch (error) {
      console.error('Erro ao entrar no grupo:', error)
      res.status(400).json({
        status: 'error',
        message: error.message
      })
    }
  },

  async leaveGroup(req, res) {
    try {
      const userId = req.user.id
      const { groupId } = req.body
      const result = await GroupService.leaveGroup(userId, groupId)
      res.json({
        status: 'success',
        data: result
      })
    } catch (error) {
      console.error('Erro ao sair do grupo:', error)
      res.status(400).json({
        status: 'error',
        message: error.message
      })
    }
  },

  async deleteGroup(req, res) {
    try {
      const userId = req.user.id
      const { id } = req.params
      const result = await GroupService.deleteGroup(Number(id), userId)
      res.json({
        status: 'success',
        data: result
      })
    } catch (error) {
      console.error('Erro ao excluir grupo:', error)
      res.status(400).json({
        status: 'error',
        message: error.message
      })
    }
  }
}