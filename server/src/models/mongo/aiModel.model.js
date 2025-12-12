"use strict";

const mongoose = require("mongoose");

const AiModelResultSchema = new mongoose.Schema(
  {
    filename: String,
    contentType: String,
    fileSizeBytes: Number,
    predictedClass: String,
    confidence: Number,
    probabilities: mongoose.Schema.Types.Mixed,
    raw: mongoose.Schema.Types.Mixed,
    success: Boolean,
    endpoint: String,
    region: String,
    isCorrect: { type: Boolean, default: null },
  },
  { _id: false, timestamps: { createdAt: true, updatedAt: false } }
);

const AiModelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    version: { type: String, default: "v1.0.0" },
    status: { type: String, default: "RUNNING" },
    results: { type: [AiModelResultSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AiModel", AiModelSchema, "ai_models");
