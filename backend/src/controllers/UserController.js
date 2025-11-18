import { UserService } from '../services/UserService.js';
import { CreateUserSchema } from '../dtos/user/CreateUserDto.js';
import { generateCrudController } from './Controller.js';

// Função para traduzir o role
const translateRole = (role) =>  {
  const roleNames = [
    { label: 'Profissional', value: 'PROFESSIONAL' },
    { label: 'Padrão', value: 'STANDARD' }
  ]
  return roleNames.find(item => item.label === role)?.value ?? null
}

// Função de transformação customizada para o UserController
const transformUserData = (data) => {
  if (data.role) {
    data.role = translateRole(data.role)
  }
  return data
}

const getProfilePicture = async (req, res) => {
  try {
    const { id } = req.user;
    // console.log(id)

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID do usuário é obrigatório'
      });
    }

    const profilePicture = await UserService.getProfilePicture(parseInt(id));

    return res.status(200).json({
      success: true,
      data: profilePicture
    });
  } catch (error) {
    console.error('Erro ao buscar foto de perfil:', error);
    return res.status(500).json({
      success: false,
      field: error.field || null,
      message: error.message || 'Erro interno do servidor'
    });
  }
}


const createTemporaryUser = async (req, res, next) => {
  try {
    let data = req.body
    if (data.role) {
      data.role = translateRole(data.role)
    }

    const tempUser = await UserService.createTemporaryUser(data)
    return res.status(201).json({
      success: true,
      data: tempUser,
      message: 'Usuário temporário criado com sucesso'
    })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const userId = req.user.id
    let data = req.body
    if (data.role) {
      data.role = translateRole(data.role)
    }

    // data.profile_picture ? console.log('tem foto') : console.log('sem foto');


    const result = await UserService.update(data, parseInt(userId))

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Usuário atualizado com sucesso'
    })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id

    const result = await UserService.remove(parseInt(userId))

    if (res.statusCode === 200) {
      res.clearCookie('token');
    }

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Conta apagada com sucesso'
    })
  } catch (error) {
    next(error)
  }
}

export const UserController = {
  ...generateCrudController(
    UserService,
    CreateUserSchema,
    'Usuário',
    transformUserData
  ),
  createTemporaryUser,
  update,
  remove,
  getProfilePicture
} 
