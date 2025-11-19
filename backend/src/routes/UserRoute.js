import { api } from "../api/UserApi.js"
import { genericRoute } from "./Route.js"
import { authenticate, authorize } from "../middleware/index.js"
import { Roles } from "../config/roles.js";
import { updatePersonalData, getPersonalData } from '../api/PersonalDataApi.js';

export default (router) => {
  router.patch("/user/personal-data", authenticate, authorize(Roles.STANDARD), updatePersonalData);
  router.get("/user/personal-data", authenticate, authorize(Roles.STANDARD), getPersonalData);

  genericRoute(router, '/user', api)
  router.post('/user/temporary', authenticate, authorize(Roles.PROFESSIONAL), api.createTemporaryUser)
  router.patch('/user', authenticate, api.update)
  router.delete('/user', authenticate, api.remove)
}