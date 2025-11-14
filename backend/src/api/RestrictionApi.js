import { RestrictionController } from '../controllers/RestrictionController.js'
import { generateCrudApi } from './Api.js'

export const api = {
  ...generateCrudApi(RestrictionController),
}