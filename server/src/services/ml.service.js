"use strict";

const {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
} = require("@aws-sdk/client-sagemaker-runtime");

const { BadRequestError } = require("../core/error.response");
const logger = require("../utils/logger");

const REGION = process.env.AWS_REGION || "us-west-1";
const ENDPOINT = process.env.SAGEMAKER_ENDPOINT || "";

const smClient = new SageMakerRuntimeClient({
  region: REGION,
});

const normalizeProbabilities = (probObj) => {
  if (!probObj || typeof probObj !== "object") return null;
  const out = {};
  Object.entries(probObj).forEach(([k, v]) => {
    const num = Number(v);
    if (!Number.isNaN(num)) out[k] = num;
  });
  return out;
};

const normalizeResult = (raw) => {
  if (Array.isArray(raw)) {
    if (raw.length && typeof raw[0] === "string") {
      try {
        raw = JSON.parse(raw[0]);
      } catch {
        return { success: false, raw };
      }
    } else if (raw.length && typeof raw[0] === "object") {
      raw = raw[0];
    }
  }

  if (typeof raw === "string") {
    return { success: false, raw };
  }

  if (typeof raw !== "object" || raw === null) {
    return { success: false, raw };
  }

  const probabilities = normalizeProbabilities(
    raw.all_probs || raw.probabilities
  );

  let predictedClass = raw.class || raw.predicted_class;
  if (!predictedClass && probabilities) {
    const top = Object.entries(probabilities).sort((a, b) => b[1] - a[1])[0];
    predictedClass = top ? top[0] : null;
  }

  let confidence = raw.confidence;
  if (
    (confidence === undefined || confidence === null) &&
    predictedClass &&
    probabilities
  ) {
    confidence = probabilities[predictedClass];
  }

  return {
    success: raw.success !== false,
    predictedClass: predictedClass || null,
    confidence:
      confidence !== undefined && confidence !== null
        ? Number(confidence)
        : null,
    probabilities,
    raw,
  };
};

class MLService {
  async classifyWithSageMaker({ buffer, contentType, filename }) {
    if (!ENDPOINT) {
      throw new BadRequestError("Missing SAGEMAKER_ENDPOINT env variable");
    }
    if (!buffer || !buffer.length) {
      throw new BadRequestError("Empty audio payload");
    }

    try {
      const command = new InvokeEndpointCommand({
        EndpointName: ENDPOINT,
        ContentType: contentType || "audio/wav",
        Body: buffer,
      });

      const response = await smClient.send(command);
      let text = "";
      if (response.Body && response.Body.transformToString) {
        text = await response.Body.transformToString();
      } else if (response.Body && response.Body.transformToByteArray) {
        const arr = await response.Body.transformToByteArray();
        text = Buffer.from(arr).toString("utf8");
      }

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }

      const normalized = normalizeResult(parsed);

      return {
        endpoint: ENDPOINT,
        region: REGION,
        contentType: contentType || "audio/wav",
        filename: filename || "audio",
        fileSizeBytes: buffer.length,
        ...normalized,
      };
    } catch (error) {
      logger.error("SageMaker invocation failed", error);
      throw error;
    }
  }
}

module.exports = new MLService();
