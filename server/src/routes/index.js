const express = require("express");
const router = express.Router();

// Mount sub-routers; app.js prefixes with `/api/v1`
router.use("/auth", require("./auth"));
router.use("/alert-types", require("./alertType"));
router.use("/alert-thresholds", require("./alertThreshold"));
router.use("/alerts", require("./alert"));

module.exports = router;
