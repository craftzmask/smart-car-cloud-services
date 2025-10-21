"use strict";

// Export Mongo (Mongoose) models
module.exports = {
  AudioEvent: require("./audioEvent.model"),
  AudioMetadata: require("./audioMetadata.model"),
  MLPredictionLog: require("./mlPredictionLog.model"),
};

