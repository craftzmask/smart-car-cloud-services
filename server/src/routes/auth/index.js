const express = require("express");
const AuthController = require("../../controllers/auth.controller");
const router = express.Router();
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

router.post("/login", asyncErrorHandler(AuthController.login));
router.post("/signup", asyncErrorHandler(AuthController.signup));

module.exports = router;
