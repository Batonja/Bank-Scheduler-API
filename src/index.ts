import express from "express";
import config from "../config.json";

const app = express();

app.listen(config.port, () => {
  console.log(`Application is listening on port:${config.port}`);
});
