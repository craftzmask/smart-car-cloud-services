const express = require("express");
const router = express.Router();

// Mount sub-routers; app.js prefixes with `/api/v1`
router.use("/auth", require("./auth"));

module.exports = router;
