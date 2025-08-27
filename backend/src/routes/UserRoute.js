import { search, insert, update, remove } from '../api/UserApi.js'
import { validate } from '../api/AuthApi.js'

const route = '/user'

export default (router) => {
  router
    .route(route)
    .get(validate, search)
    .post(insert)

  router
    .route(`${route}/:id`)
    .patch(validate, update)
    .delete(validate, remove)
}
