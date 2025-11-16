import { api } from "../api/HealthDataApi.js";
import { genericRoute } from "./Route.js";
import { authenticate, authorize } from '../middleware/index.js';
import { Roles } from "../config/roles.js";

export default (router) => {
  genericRoute(router, "/health-data", api, authenticate, authorize(Roles.STANDARD));
};