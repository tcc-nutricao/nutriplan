import { api } from "../api/ObjectiveApi.js";
import { genericRoute } from "./Route.js";

export default (router) => {
  genericRoute(router, "/objective", api);
};
