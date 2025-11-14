import { updatePersonalData, getPersonalData } from "../api/PersonalDataApi.js";
import { authenticate, authorize } from "../middleware/index.js";
import { Roles } from "../config/roles.js";

export default (router) => {
  router.patch("/user/personal-data", authenticate, authorize(Roles.STANDARD), updatePersonalData);
  router.get("/user/personal-data", authenticate, authorize(Roles.STANDARD), getPersonalData);
};
