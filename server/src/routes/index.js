const express = require("express");
const router = express.Router();

// Mount sub-routers; app.js prefixes with `/api/v1`
router.use("/auth", require("./auth"));
router.use("/alert-types", require("./alertType"));
router.use("/alert-thresholds", require("./alertThreshold"));
router.use("/alerts", require("./alert"));
router.use("/sse", require("./sse"));
router.use("/cars", require("./car"));
router.use("/service-configurations", require("./serviceConfig"));
router.use("/subscriptions", require("./subscription"));
router.use("/ml", require("./ml"));
router.use("/owner", require("./owner"));
router.use("/iot", require("./iot"));
router.use("/cloud", require("./cloud"));
router.use("/ai-models", require("./aiModel"));

module.exports = router;
