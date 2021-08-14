import express, { Router } from "express";
import asyncHandler from "express-async-handler";
import MainController from "../controllers/MainController";
import { validate } from "jsonschema";
import updateMyFetchingPeriodSchema from "../schemas/updateMyFetchingPeriodSchema";
import validateRequest from "../middleware/validateRequest";
const mainRouter: Router = express.Router();

mainRouter.post(
  "/api/main/updateMyFetchingPeriod",
  validateRequest(updateMyFetchingPeriodSchema),
  asyncHandler(MainController.updateMyFetchingPeriod)
);

export default mainRouter;
