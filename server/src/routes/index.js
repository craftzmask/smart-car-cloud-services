"use strict";

const express = require("express");
const router = express.Router();

const { OK } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");
const asyncErrorHandler = require("../helpers/asyncErrorHandler");

router.get(
  "/ping",
  asyncErrorHandler(async (_req, res) => {
    new OK({
      message: "pong",
      metadata: [],
    }).send(res);
  })
);

router.get(
  "/error",
  asyncErrorHandler(async (_req, _res) => {
    throw new BadRequestError("Error Thrown");
  })
);

module.exports = router;
