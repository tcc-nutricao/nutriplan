import { updatePersonalData, getPersonalData } from "../api/PersonalDataApi.js";
import { validate } from "../api/AuthApi.js";

export default (router) => {
  console.log("Carregando rota PersonalDataRoute");
  router.patch("/user/personal-data", validate, updatePersonalData);
  router.get("/user/personal-data", validate, getPersonalData);
};
