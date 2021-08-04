import express from "express";
import config from "../config.json";
import mainRouter from "./routers/MainRouter";

const app = express();
app.use(express.json());
app.use(mainRouter);

app.listen(config.port, () => {
  console.log(`Application is listening on port:${config.port}`);
});
