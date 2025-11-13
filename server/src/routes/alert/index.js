"use strict"

const express = require("express");
const router = express.Router();

const AlertsController = require("../../controllers/alert.controller");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

router.post("", asyncErrorHandler(AlertsController.create));
router.get("", asyncErrorHandler(AlertsController.getAlerts));
router.get("/:alertId", asyncErrorHandler(AlertsController.getAlert));
router.patch("/:alertId/status", asyncErrorHandler(AlertsController.updateStatus));


module.exports = router;