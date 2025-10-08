"use strict";

const express = require("express");
const router = express.Router();
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");
const AuthController = require("../../controllers/auth.controller");

router.post("/login", asyncErrorHandler(AuthController.login));
router.post("/signup", asyncErrorHandler(AuthController.signup));

module.exports = router;
