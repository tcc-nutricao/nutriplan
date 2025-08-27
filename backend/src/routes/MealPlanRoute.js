import { search, insert, update, remove } from '../api/MealPlanApi.js'
import { validate } from '../api/AuthApi.js'

const route = '/meal-plan'

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
