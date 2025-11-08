"use strict";

const express = require("express");
const router = express.Router();

const AlertThresholdController = require("../../controllers/alertThreshold.controller");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

// List all thresholds
// GET /api/v1/alert-thresholds?limit=&offset=
router.get(
    "/",
    asyncErrorHandler(AlertThresholdController.list)
);

// Stats
// GET /api/v1/alert-thresholds/stats
router.get(
    "/stats",
    asyncErrorHandler(AlertThresholdController.stats)
);

// Get by alertType (place BEFORE :id to avoid conflicts)
// GET /api/v1/alert-thresholds/type/:alertType
router.get(
    "/type/:alertType",
    asyncErrorHandler(AlertThresholdController.getByType)
);

// Get by id
// GET /api/v1/alert-thresholds/:id
router.get(
    "/:id",
    asyncErrorHandler(AlertThresholdController.getById)
);

// Create
// POST /api/v1/alert-thresholds
router.post(
    "/",
    asyncErrorHandler(AlertThresholdController.create)
);

// Full update by id
// PUT /api/v1/alert-thresholds/:id
router.put(
    "/:id",
    asyncErrorHandler(AlertThresholdController.update)
);

// Partial update by id
// PATCH /api/v1/alert-thresholds/:id
router.patch(
    "/:id",
    asyncErrorHandler(AlertThresholdController.patch)
);

// Delete by id
// DELETE /api/v1/alert-thresholds/:id
router.delete(
    "/:id",
    asyncErrorHandler(AlertThresholdController.delete)
);

module.exports = router;
