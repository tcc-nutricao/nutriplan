import { api } from "../api/ObjectiveApi.js";
import { genericRoute } from "./Route.js";
import { authenticate } from '../middleware/index.js';

export default (router) => {
  genericRoute(router, "/objective", api, authenticate);
};
