import { login } from '../api/AuthApi.js';

const route = '/auth';

export default (router) => {
  router.post(`${route}/login`, login);
};
