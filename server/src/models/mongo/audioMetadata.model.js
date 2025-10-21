"use strict";

const mongoose = require("mongoose");
const common = require("./_common");

/**
 * AudioMetadata
 * - Stores metadata for uploaded audio snippets.
 * - Referenced by AudioEvent and MLPredictionLog.
 */
const AudioMetadataSchema = new mongoose.Schema(
  {
    // Optional custom string id: keep default _id and expose 'id' via toJSON
    duration: { type: Number, min: 0, required: false }, // seconds
    fileUrl: { type: String, required: true },
    fileSize: { type: Number, min: 0, required: false }, // bytes
    sampleRate: { type: Number, min: 0, required: false }, // Hz
    format: { type: String, required: false }, // e.g., wav, mp3
  },
  common
);

AudioMetadataSchema.index({ fileUrl: 1 }, { unique: false });

module.exports = mongoose.model("AudioMetadata", AudioMetadataSchema, "audio_metadata");

