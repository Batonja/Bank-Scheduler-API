import express, { Router } from "express";
import asyncHandler from "express-async-handler";
import MainController from "../controllers/MainController";

const mainRouter: Router = express.Router();

mainRouter.post("/api/main/login", asyncHandler(MainController.login));

export default mainRouter;
