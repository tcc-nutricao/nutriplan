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

export const UserController = generateCrudController(
  UserService,
  CreateUserSchema,
  'Usuário',
  transformUserData
)
