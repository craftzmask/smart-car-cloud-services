"use strict";

const app = require("./app");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 8080;

// Start HTTP server
app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
