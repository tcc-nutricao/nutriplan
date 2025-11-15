import { authenticate } from '../middleware/index.js'

export const genericRoute = (router, route, api, authenticateMiddleware, authorizationMiddleware) => {
  const { search, insert, update, remove } = api;

  const middlewares = [];
  
  if (authenticateMiddleware) {
    middlewares.push(authenticateMiddleware);
  }
  
  if (authorizationMiddleware) {
    middlewares.push(authorizationMiddleware);
  }

  router.route(route)
    .get(...middlewares, search)
    .post(...middlewares, insert);

  router.route(`${route}/:id`)
    .patch(...middlewares, update)
    .delete(...middlewares, remove);
};
