"use strict";

const express = require("express");
const router = express.Router();

const OwnerDashboardController = require("../../controllers/ownerDashboard.controller");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");
const {authenticate} = require("../../middlewares/auth.middleware");

router.get("/dashboard", authenticate, asyncErrorHandler(OwnerDashboardController.getDashboard.bind(OwnerDashboardController)));
router.put("/dashboard", authenticate, asyncErrorHandler(OwnerDashboardController.upsertDashboard.bind(OwnerDashboardController)));
router.post("/dashboard/refresh", authenticate, asyncErrorHandler(OwnerDashboardController.refreshDashboard.bind(OwnerDashboardController)));

module.exports = router;
