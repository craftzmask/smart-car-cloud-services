"use strict"

const express = require("express");
const router = express.Router();

const AlertsController = require("../../controllers/alert.controller");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

router.post("", asyncErrorHandler(AlertsController.create));

module.exports = router;