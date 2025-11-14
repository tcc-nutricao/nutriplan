import { authenticate } from "../api/AuthApi.js";

export const genericRoute = (router, route, api) => {
  const { search, insert, update, remove } = api;
  
  router.route(route).get(authenticate, search).post(insert);
  router.route(`${route}/:id`).patch(authenticate, update).delete(validate, remove);
};
