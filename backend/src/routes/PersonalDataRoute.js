import { updatePersonalData } from '../api/PersonalDataApi.js'
import { validate } from '../api/AuthApi.js'

export default (router) => {
  router.patch('/user/personal-data', validate, updatePersonalData)
}
