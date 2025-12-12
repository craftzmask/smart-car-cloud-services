"use strict";

const express = require("express");
const router = express.Router();

const CloudDashboardController = require("../../controllers/cloudDashboard.controller");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");
const {authenticate} = require("../../middlewares/auth.middleware");

router.get("/dashboard", authenticate, asyncErrorHandler(CloudDashboardController.getOverview.bind(CloudDashboardController)));
router.post("/dashboard/refresh", authenticate, asyncErrorHandler(CloudDashboardController.refresh.bind(CloudDashboardController)));

module.exports = router;
