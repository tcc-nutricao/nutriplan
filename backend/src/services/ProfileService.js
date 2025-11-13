import { NutritionistRepository } from '../repositories/NutritionistRepository.js';
import { PatientRepository } from '../repositories/PatientRepository.js';
import { AppError } from '../exceptions/AppError.js';

export const ProfileService = {
  async getProfileByRole(id, role) {
    try {
      if (!role) {
      throw new AppError({ message: 'Role do usuário não fornecida', field: 'role' });
    }

    if (role === 'PROFESSIONAL') {
      return await NutritionistRepository.findByUserId(id);
    } else if (role === 'STANDARD') {
      return await PatientRepository.findByUserId(id);
    }

    return { data: [], total: 0, message: 'Role não reconhecida' };

    } catch (error) {
      throw new AppError({ message: 'Erro ao buscar perfil: ' + error.message });
    }
  }
}