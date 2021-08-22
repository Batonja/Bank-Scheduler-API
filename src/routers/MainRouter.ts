import express, { Router } from "express";
import asyncHandler from "express-async-handler";
import MainController from "../controllers/MainController";
import { validate } from "jsonschema";
import updateMyFetchingPeriodSchema from "../schemas/updateMyFetchingPeriodSchema";
import validateRequest from "../middleware/validateRequest";
const mainRouter: Router = express.Router();
import config from "../../config.json";

mainRouter.post(
  `${config.mainPath}${config.updateMyFetchingPeriodPath}`,
  validateRequest(updateMyFetchingPeriodSchema),
  asyncHandler(MainController.updateMyFetchingPeriod)
);

mainRouter.get(
  `${config.mainPath}/getAllTransactions`,
  asyncHandler(MainController.getAll)
);

mainRouter.post(
  `${config.mainPath}${config.sendAllScheduledRequestsPath}`,
  asyncHandler(MainController.sendAllScheduledRequests)
);

export default mainRouter;
