"use strict";

const logger = require("../utils/logger");
const CognitoService = require("../services/cognito.service");

const decodeJwtPayload = (token) => {
  try {
    const part = token?.split(".")[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(b64, "base64").toString();
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

const buildUser = (payload) => {
  const groups = payload["cognito:groups"] || payload.groups || [];
  const role = groups.includes("admin")
    ? "admin"
    : groups.includes("staff")
      ? "staff"
      : "user";
  const cognitoUsername =
    payload["cognito:username"] || payload.username || payload.sub;
  const email = payload.email || payload["custom:email"];
  return {
    username: (cognitoUsername || email || "").toLowerCase(),
    email: email || null,
    sub: payload.sub,
    groups,
    role,
    cognitoUsername,
  };
};

const authenticate = async (req, res, next) => {
  try {
    const gwUsername = req.headers["x-cognito-username"];
    if (gwUsername) {
      const groupsHeader = req.headers["x-cognito-groups"];
      const payload = {
        "cognito:username": gwUsername,
        "cognito:groups": groupsHeader
          ? String(groupsHeader)
              .split(",")
              .map((g) => g.trim())
          : [],
        email: req.headers["x-cognito-email"],
        sub: req.headers["x-cognito-sub"],
      };
      req.user = buildUser(payload);
      return next();
    }

    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "Error",
        code: 401,
        message: "Authorization token required",
      });
    }

    const token = authHeader.split(" ")[1];
    try {
      const { payload } = await CognitoService.decodeToken(token);
      req.user = buildUser(payload);
      return next();
    } catch (err) {
      const allowFallback =
        err?.cause?.name === "ParameterValidationError" ||
        err?.message === "Cognito token verifiers are not configured";
      if (allowFallback) {
        const payload = decodeJwtPayload(token);
        if (payload) {
          logger.warn(
            "JWT verified disabled; decoded payload without signature (dev only)"
          );
          req.user = buildUser(payload);
          return next();
        }
      }
      return res.status(401).json({
        status: "Error",
        code: 401,
        message: "Invalid or expired token",
      });
    }
  } catch (error) {
    logger.error("Auth middleware error", error);
    return res.status(500).json({
      status: "Error",
      code: 500,
      message: "Failed to process authentication",
    });
  }
};

module.exports = { authenticate };
