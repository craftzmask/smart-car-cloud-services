"use strict";

const express = require("express");
const AlertTypeController = require("../../controllers/alertType.controller");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");
const {Alert} = require("../../models/sql");

const router = express.Router();

// Get alert types
router.get("", asyncErrorHandler(AlertTypeController.list));

// Get an alert type
router.post("/:type", asyncErrorHandler(AlertTypeController.getByType));

// Create an alert type
router.post(
    "",
    asyncErrorHandler(AlertTypeController.create)
);

// Rename a type
router.patch(
    "/:type",
    asyncErrorHandler(AlertTypeController.rename)
);

// Delete a type
router.delete("/:type", asyncErrorHandler(AlertTypeController.delete));

module.exports = router;