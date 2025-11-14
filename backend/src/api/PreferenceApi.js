import { PreferenceController } from '../controllers/PreferenceController.js'
import { generateCrudApi } from './Api.js'

export const api = {
  ...generateCrudApi(PreferenceController),
}