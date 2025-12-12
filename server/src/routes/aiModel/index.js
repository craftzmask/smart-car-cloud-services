"use strict";

const express = require("express");
const multer = require("multer");
const upload = multer();
const AiModelController = require("../../controllers/aiModel.controller");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

const router = express.Router();

router.get("", asyncErrorHandler(AiModelController.list));
router.post("", asyncErrorHandler(AiModelController.create));
router.post(
  "/:id/predict",
  upload.single("file"),
  asyncErrorHandler(AiModelController.classify)
);
router.patch(
  "/:id/results/judge",
  asyncErrorHandler(AiModelController.judgeResult)
);

module.exports = router;
