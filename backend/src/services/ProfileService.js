import { NutritionistRepository } from '../repositories/NutritionistRepository.js';
import { PatientRepository } from '../repositories/PatientRepository.js';

export const ProfileService = {
  async getProfileByRole(id, role) {
    try {
      if (!role) {
      throw new Error('Role do usuário não fornecida');
    }

    console.log(role)

    if (role === 'PROFESSIONAL') {
      return await NutritionistRepository.findByUserId(id);
    } else if (role === 'STANDARD') {
      return await PatientRepository.findByUserId(id);
    }

    return { data: [], total: 0, message: 'Role não reconhecida' };

    } catch (error) {
      throw new Error('Erro ao buscar perfil: ' + error.message);
    }
  }
}