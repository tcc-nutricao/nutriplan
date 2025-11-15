import { api } from "../api/UnitOfMeasurementApi.js";
import { genericRoute } from "./Route.js";
import { authenticate } from '../middleware/index.js';

export default (router) => {
  genericRoute(router, '/unit-of-measurement', api, authenticate);
};
