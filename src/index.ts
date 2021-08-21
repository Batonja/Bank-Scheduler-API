import express from "express";
import config from "../config.json";
import ErrorController from "./controllers/ErrorController";
import connectToDB from "./database/connectToDB";
import mainRouter from "./routers/MainRouter";

const app = express();
app.use(express.json());
app.use(mainRouter);
app.use(ErrorController.handleError);

connectToDB();

app.listen(config.port, () => {
  console.log(`Application is listening on port:${config.port}`);
});
