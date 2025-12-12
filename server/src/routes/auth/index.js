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

// Confirm sign up
router.post("/confirm", asyncErrorHandler(AuthController.confirm));

// Resend confirmation code
router.post("/resend", asyncErrorHandler(AuthController.resend));

// Get current user profile
router.get(
  "/profile",
  authenticate,
  asyncErrorHandler(AuthController.getProfile)
);

// Update user role
router.patch(
  "/role/:username",
  authenticate,
  asyncErrorHandler(AuthController.updateRole)
);

// Refresh tokens
router.post(
  "/refresh",
  asyncErrorHandler(AuthController.refresh)
);

module.exports = router;
