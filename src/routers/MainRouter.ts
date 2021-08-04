import express, { Router } from "express";
import asyncHandler from "express-async-handler";
import MainController from "../controllers/MainController";

const mainRouter: Router = express.Router();

mainRouter.get("/", asyncHandler(MainController.home));

export default mainRouter;
