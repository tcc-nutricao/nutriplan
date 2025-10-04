import { api } from "../api/UnitOfMeasurementApi.js";
import { genericRoute } from "./Route.js";

export default (router) => {
  genericRoute(router, '/unit-of-measurement', api);
};
