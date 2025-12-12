"use strict";

const { OK, CREATED } = require("../core/success.response");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const MLService = require("../services/ml.service");
const AiModel = require("../models/mongo/aiModel.model");
const logger = require("../utils/logger");

class AiModelController {
  async list(req, res) {
    const models = await AiModel.find().sort({ updatedAt: -1 }).lean();
    return new OK({ message: "AI models fetched", data: models }).send(res);
  }

  async create(req, res) {
    const { name, type, version, status } = req.body || {};
    if (!name || !type) {
      throw new BadRequestError("name and type are required");
    }
    const model = await AiModel.create({
      name,
      type,
      version: version || "v1.0.0",
      status: status || "RUNNING",
    });
    return new CREATED({ message: "AI model created", data: model }).send(res);
  }

  async classify(req, res) {
    const { id } = req.params;
    const model = await AiModel.findById(id);
    if (!model) throw new NotFoundError("Model not found");

    const file = req.file;
    if (!file) throw new BadRequestError("Audio file is required (field name: file)");

    const result = await MLService.classifyWithSageMaker({
      buffer: file.buffer,
      contentType: file.mimetype || "audio/wave",
      filename: file.originalname,
    });

    const createdAt = new Date();
    const storedResult = {
      filename: result.filename,
      contentType: result.contentType,
      fileSizeBytes: result.fileSizeBytes,
      predictedClass: result.predictedClass,
      confidence: result.confidence,
      probabilities: result.probabilities,
      raw: result.raw,
      success: result.success,
      endpoint: result.endpoint,
      region: result.region,
      isCorrect: null,
      createdAt,
    };

    model.results.push(storedResult);
    model.updatedAt = new Date();
    await model.save();

    logger.info("Stored ML result for model", { id: model._id, predictedClass: result.predictedClass });

    return new OK({
      message: "Classification completed",
      data: { modelId: model._id, ...result, createdAt },
    }).send(res);
  }

  async judgeResult(req, res) {
    const { id } = req.params;
    const { filename, isCorrect, createdAt } = req.body || {};
    if (typeof isCorrect !== "boolean") {
      throw new BadRequestError("isCorrect (boolean) is required");
    }

    const model = await AiModel.findById(id);
    if (!model) throw new NotFoundError("Model not found");

    const match = model.results.find((r) => {
      if (createdAt && r.createdAt) {
        return String(new Date(r.createdAt).getTime()) === String(new Date(createdAt).getTime());
      }
      return r.filename === filename;
    });

    if (!match) {
      throw new NotFoundError("Result not found");
    }

    match.isCorrect = isCorrect;
    model.markModified("results");
    await model.save();

    return new OK({
      message: "Result judgement updated",
      data: { modelId: model._id, filename: match.filename, isCorrect },
    }).send(res);
  }
}

module.exports = new AiModelController();
