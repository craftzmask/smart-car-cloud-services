"use strict";

const express = require("express");
const router = express.Router();

const AlertThresholdController = require("../../controllers/alertThreshold.controller");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

router.get(
    "/",
    asyncErrorHandler(AlertThresholdController.list)
);


router.get(
    "/type/:alertType",
    asyncErrorHandler(AlertThresholdController.getByType)
);


router.get(
    "/:id",
    asyncErrorHandler(AlertThresholdController.getById)
);


router.post(
    "/",
    asyncErrorHandler(AlertThresholdController.create)
);


router.put(
    "/:id",
    asyncErrorHandler(AlertThresholdController.update)
);


router.patch(
    "/:id",
    asyncErrorHandler(AlertThresholdController.patch)
);


router.delete(
    "/:id",
    asyncErrorHandler(AlertThresholdController.delete)
);

module.exports = router;
