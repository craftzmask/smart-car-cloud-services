"use strict";

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger");
const app = express();
const logger = require("./utils/logger");
// Surface the package version at the root endpoint for easier diagnostics
const { version: APP_VERSION } = require("../package.json");

const { StatusCodes, ReasonPhrases } = require("./utils/httpStatusCode");

// Pretty-print JSON in non-production for easier debugging
const ENV = (process.env.NODE_ENV || "dev").toLowerCase();

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser or same-origin requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middlewares
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Initialize PostgreSQL Database (for Users)
// Establishes a connection used by the user management module (Sequelize/PostgreSQL).
const initPostgreSQL = async () => {
  try {
    const database = require("./dbs/init.database");
    await database.connect();
    logger.info("PostgreSQL initialized for user management");
  } catch (error) {
    logger.error("PostgreSQL initialization failed:", error.message);
    // Don't exit - let the app start but log the error
  }
};

// Initialize MongoDB (for other services)
// Mongoose is initialized for non-user services (telemetry, alerts, etc.).
const initMongoDB = async () => {
  try {
    require("./dbs/init.mongodb");
    logger.info("MongoDB initialized for other services");
  } catch (error) {
    logger.error("MongoDB initialization failed:", error.message);
    // Don't exit - let the app start but log the error
  }
};

// Initialize all databases
(async () => {
  logger.info("Initializing databases...");
  await initPostgreSQL();
  await initMongoDB();
  logger.info("Database initialization complete");
})();

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: (process.env.NODE_ENV || "dev").toLowerCase(),
  });
});

// API docs
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { explorer: true })
);

// API routes
app.use("/api/v1", require("./routes"));

// Root endpoint
app.get("/", (_req, res) => {
  // Self-documenting root endpoint
  res.status(200).json({
    message: "Car Service API",
    version: APP_VERSION,
    endpoints: {
      health: "/health",
      api: "/api/v1",
      docs: "/docs",
    },
  });
});

// 404 handler - route not found
app.use((_req, _res, next) => {
  const error = new Error(ReasonPhrases.NOT_FOUND);
  error.status = StatusCodes.NOT_FOUND;
  next(error);
});

// Global error handler
app.use((error, _req, res, _next) => {
  const statusCode =
    error.status || error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  // Log error only in non-production to avoid noisy logs
  if (process.env.NODE_ENV !== "production") {
    logger.error("Unhandled error", error);
  }

  return res.status(statusCode).json({
    status: "Error",
    code: statusCode,
    message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    ...(process.env.NODE_ENV === "dev" && {
      details: error.details,
      stack: error.stack,
    }),
  });
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.warn("SIGTERM received, shutting down gracefully...");

  try {
    const database = require("./dbs/init.database");
    await database.disconnect();
    logger.info("Databases disconnected");
  } catch (error) {
    logger.error("Error during shutdown:", error);
  }

  process.exit(0);
});

module.exports = app;
