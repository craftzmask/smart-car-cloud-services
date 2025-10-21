"use strict";

const express = require("express");
const AuthController = require("../../controllers/auth.controller");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");
const { authenticate } = require("../../middlewares/auth.middleware");

const router = express.Router();

// User signup
router.post("/signup", asyncErrorHandler(AuthController.signup));

// User login
router.post("/login", asyncErrorHandler(AuthController.login));

// Get user profile
router.get(
  "/profile/:username",
  authenticate,
  asyncErrorHandler(AuthController.getProfile)
);

// Update user role
router.patch(
  "/role/:username",
  authenticate,
  asyncErrorHandler(AuthController.updateRole)
);

module.exports = router;