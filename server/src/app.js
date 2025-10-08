"use strict";

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();

const { StatusCodes, ReasonPhrases } = require("./utils/httpStatusCode");

const middleware = (req, _res, next) => {
  console.log("Before I go to express.json()");
  console.log("body::", req.body);
  next();
};

const middleware1 = (req, _res, next) => {
  console.log("After I go to express.json()");
  console.log("body::", req.body);
  next();
};

app.use(middleware);

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(middleware1);

// init db
require("./dbs/init.mongodb");

// init routes
app.use("/", require("./routes"));

// handling route not found
app.use((_req, _res, next) => {
  const error = new Error(ReasonPhrases.NOT_FOUND);
  error.status = StatusCodes.NOT_FOUND;
  next(error);
});

// handling error
app.use((error, _req, res, _next) => {
  const statusCode = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
  return res.status(statusCode).json({
    status: "Error",
    code: statusCode,
    message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    error: error.stack,
  });
});

module.exports = app;
