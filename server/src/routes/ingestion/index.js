"use strict";

const express = require("express");
const router = express.Router();
const multer = require("multer");
const IngestionController = require("../../controllers/ingestion.controller");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

const upload = multer({
    // dest: os.tmpdir(),
    limits: {fileSize: 10 * 1024 * 1024}
});

router.post(
    "/audio",
    upload.single("file"),
    asyncErrorHandler(IngestionController.ingestAudio)
);

module.exports = router;