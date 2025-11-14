import { updatePersonalData, getPersonalData } from "../api/PersonalDataApi.js";
import { authenticate } from "../api/AuthApi.js";

export default (router) => {
  router.patch("/user/personal-data", authenticate, updatePersonalData);
  router.get("/user/personal-data", authenticate, getPersonalData);
};
