import { api } from "../api/PatientApi.js";
import { genericRoute } from "./Route.js";
import { validate } from "../api/AuthApi.js";

export default (router) => {
  genericRoute(router, "/patient", api);
  //Rotas com customizações
  router.get("/patient/me", validate, api.getMe);
  // Rota customizada para progresso do paciente
  router.get("/patient/:id/progress", validate, api.getProgress);
};
