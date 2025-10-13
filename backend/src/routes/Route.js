import { validate } from "../api/AuthApi.js";

export const genericRoute = (router, route, api) => {
  const { search, insert, update, remove } = api;

  router.route(route).get(validate, search).post(insert);

  router.route(`${route}/:id`).patch(validate, update).delete(validate, remove);
};
