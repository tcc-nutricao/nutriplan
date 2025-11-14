import { authenticate } from '../middleware/index.js'

export const genericRoute = (router, route, api, authorizationMiddleware = null) => {
  const { search, insert, update, remove } = api;

  const middlewares = authorizationMiddleware 
    ? [authenticate, authorizationMiddleware] 
    : [authenticate];

  router.route(route)
    .get(...middlewares, search)
    .post(...middlewares, insert);

  router.route(`${route}/:id`)
    .patch(...middlewares, update)
    .delete(...middlewares, remove);
};
