import { updatePersonalData } from '../api/PersonalDataApi.js'
import { validate } from '../api/AuthApi.js'

export default (router) => {
  router.patch('/personal-data', validate, updatePersonalData)
}
