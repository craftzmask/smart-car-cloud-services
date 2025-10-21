"use strict";

const mongoose = require("mongoose");
const common = require("./_common");

/**
 * MLPredictionLog
 * - Captures inference details and linkage to events/alerts.
 */
const MLPredictionLogSchema = new mongoose.Schema(
  {
    modelId: { type: String, required: true },
    modelVersion: { type: String, required: false },
    carId: { type: String, required: true },
    deviceId: { type: String, required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "AudioEvent", required: false },
    alertId: { type: String, required: false },
    audioMetadataId: { type: mongoose.Schema.Types.ObjectId, ref: "AudioMetadata", required: false },
    timestamp: { type: Date, required: true },
    confidence: { type: Number, min: 0, max: 1, required: false },
    predictionPassed: { type: Boolean, default: false },
  },
  common
);

MLPredictionLogSchema.index({ modelId: 1, modelVersion: 1, timestamp: -1 });
MLPredictionLogSchema.index({ carId: 1, deviceId: 1, timestamp: -1 });
MLPredictionLogSchema.index({ eventId: 1 });
MLPredictionLogSchema.index({ audioMetadataId: 1 });

module.exports = mongoose.model("MLPredictionLog", MLPredictionLogSchema, "ml_prediction_logs");

