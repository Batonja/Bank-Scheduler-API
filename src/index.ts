import express from "express";
import config from "../config.json";
import ErrorController from "./controllers/ErrorController";
import connectToDB from "./database/connectToDB";
import mainRouter from "./routers/MainRouter";
import { CronJob } from "cron";
import MainService from "./services/implementations/MainService";

const app = express();
app.use(express.json());
app.use(mainRouter);
app.use(ErrorController.handleError);

connectToDB();

const job = new CronJob("0 0 * 1-31 0-11 0-6", () => {
  MainService.consumeFromQueue();
});

app.listen(config.port, () => {
  console.log(`Application is listening on port:${config.port}`);
});
