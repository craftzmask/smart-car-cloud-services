"use strict";

// Authentication middleware collection
// - extractUser: from API Gateway headers (production path)
// - extractUserLocal: from unsigned JWT (development only)
// - authenticate: auto-detects and chooses the appropriate strategy
// - logUser: optional request-scoped user debug log
const logger = require("../utils/logger");

// Extract user details from API Gateway headers
// Attaches req.user = { username, email, sub, groups, role }
const extractUser = (req, res, next) => {
  try {
    const username = req.headers["x-cognito-username"];
    const email = req.headers["x-cognito-email"];
    const sub = req.headers["x-cognito-sub"];
    const groupsHeader = req.headers["x-cognito-groups"];

    if (!username) {
      return res.status(401).json({
        status: "Error",
        code: 401,
        message: "Authentication required",
      });
    }

    const groups = groupsHeader ? groupsHeader.split(",").map((g) => g.trim()) : [];

    let primaryRole = "user";
    if (groups.includes("admin")) {
      primaryRole = "admin";
    } else if (groups.includes("staff")) {
      primaryRole = "staff";
    }

    req.user = {
      username,
      email,
      sub,
      groups,
      role: primaryRole,
    };

    next();
  } catch (error) {
    logger.error("Error extracting user", error);
    return res.status(500).json({
      status: "Error",
      code: 500,
      message: "Failed to process authentication",
    });
  }
};

// Extract user details from a local JWT for development (no verification)
const extractUserLocal = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "Error",
        code: 401,
        message: "Authorization token required",
      });
    }

    const token = authHeader.split(" ")[1];
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, "base64")
        .toString()
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const decoded = JSON.parse(jsonPayload);
    const groups = decoded["cognito:groups"] || [];

    let primaryRole = "user";
    if (groups.includes("admin")) {
      primaryRole = "admin";
    } else if (groups.includes("staff")) {
      primaryRole = "staff";
    }

    req.user = {
      username: decoded["cognito:username"] || decoded.username,
      email: decoded.email,
      sub: decoded.sub,
      groups,
      role: primaryRole,
    };

    next();
  } catch (error) {
    logger.warn("Error decoding token in local mode", error);
    return res.status(401).json({
      status: "Error",
      code: 401,
      message: "Invalid token",
    });
  }
};

// Choose the right extraction strategy
const authenticate = (req, res, next) => {
  const isAPIGateway =
    req.headers["x-cognito-username"] ||
    req.headers["x-apigateway-event"] ||
    req.headers["x-amzn-requestid"];

  if (isAPIGateway) {
    return extractUser(req, res, next);
  }
  logger.warn("Running in local auth mode - no API Gateway verification");
  return extractUserLocal(req, res, next);
};

// Log authenticated user info for debugging
const logUser = (req, res, next) => {
  if (req.user) {
    logger.debug("Authenticated user", {
      username: req.user.username,
      role: req.user.role,
      groups: req.user.groups,
    });
  }
  next();
};

module.exports = {
  authenticate,
  extractUser,
  extractUserLocal,
  logUser,
};
