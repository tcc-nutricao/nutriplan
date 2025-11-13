import { ProfileService } from '../services/ProfileService.js';

export const ProfileController = {
  async getProfileByRole(req, res) {
    try {
      const { id, role } = req.user;

      const profileData = await ProfileService.getProfileByRole(id, role);

      return res.status(200).json({
        success: true,
        data: profileData,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        field: error.field || null,
        message: error.message || 'Erro ao buscar perfil',
      });
    }
  }
}