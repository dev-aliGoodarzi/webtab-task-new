// Express
import express from "express";
// Express

// Routes
import { AdminRoutes } from "./Routes/Admin/AdminRoutesIndex";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import {
  languagesArray,
  T_ValidLanguages,
} from "./Constants/Languages/languageTypes";
// Routes

// Configs
require("dotenv").config();
// Configs

import swaggerUi from "swagger-ui-express";
import { DemoDataRoutes } from "./Routes/demo-data/DemoDataRoutes";

// #region #init
const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
// #region Middlewares
app.use((bodyParser as any).json());
app.use((bodyParser as any).urlencoded({ extended: true }));
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
// #region Language Middleware
app.use((req, res, next) => {
  const language = req.headers.language;
  if (typeof language === "undefined") {
    req.headers.language = "en";
  }
  if (typeof language === "string") {
    if (!languagesArray.includes(language as T_ValidLanguages)) {
      req.headers.language = "en";
    }
  }
  next();
});
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
// #region API DOCUMANTS
app.use(
  "/documentation/swagger-ui",
  swaggerUi.serve,
  swaggerUi.setup(require("./../Swagger/SwaggerJson.json"), {
    explorer: true,
  })
);
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
// #region demoRoutes V1
app.use("/demo", AdminRoutes);
app.use("/demo", DemoDataRoutes);
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
// #region Mongoose
const currMode = process.env.NODE_ENV === "production" ? "prod" : "dev";
const mongodbURI =
  currMode === "dev"
    ? process.env.MONGODB_CONNECTION_STRING_LOCAL!
    : process.env.MONGODB_CONNECTION_STRING_PROD!;

let dbStatus = {
  isConnected: false,
  url:
    currMode === "prod"
      ? mongodbURI.split("").splice(0, 10).join("")
      : mongodbURI,
  mongoError: "",
};
mongoose
  .connect(mongodbURI)
  .then(() => {
    console.log(`Mongodb Connected on ${mongodbURI}`);
  })
  .catch((err) => {
    console.log(err);
    dbStatus.isConnected = false;
    dbStatus.mongoError = JSON.stringify(err);
  });
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
// #region Server Run
app.listen(process.env.LISTEN_PORT, () => {
  console.log(`Server Runs On Port ${process.env.LISTEN_PORT}`);
});
