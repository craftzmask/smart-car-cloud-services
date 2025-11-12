"use strict";

const express = require("express");
const AlertTypeController = require("../../controllers/alertType.controller");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

const router = express.Router();

router.get("", asyncErrorHandler(AlertTypeController.list));

router.post("/:type", asyncErrorHandler(AlertTypeController.getByType));

router.post(
    "",
    asyncErrorHandler(AlertTypeController.create)
);

router.patch(
    "/:type",
    asyncErrorHandler(AlertTypeController.rename)
);

router.delete("/:type", asyncErrorHandler(AlertTypeController.delete));

module.exports = router;