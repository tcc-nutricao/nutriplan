import { ProfileController } from '../controllers/ProfileController.js'

// Mescla CRUD padrão com métodos customizados do controller
export const api = {
  getProfileByRole: ProfileController.getProfileByRole
}