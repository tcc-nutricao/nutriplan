import { search, insert, update, remove } from '../api/MealPlanApi.js'

const route = '/meal-plan'

export default (router) => {
  router
    .route(route)
    .get(search)
    .post(insert)

  router
    .route(`${route}/:id`)
    .patch(update)
    .delete(remove)
}
