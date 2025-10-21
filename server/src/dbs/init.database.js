"use strict";

// Sequelize/PostgreSQL connection manager
// Provides a singleton Database with connect/disconnect helpers.

const { Sequelize } = require("sequelize");
const config = require("../config/database");
const logger = require("../utils/logger");

const env = (process.env.NODE_ENV || "dev").toLowerCase();
const dbConfig = config[env];

if (!dbConfig) {
  logger.error(`Database config not found for environment: ${env}`);
  logger.error(`Available environments:`, Object.keys(config));
  throw new Error(`Database configuration missing for environment: ${env}`);
}

logger.info(`Loading database config for environment: ${env}`);

// Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions || {},
  }
);

// Database connection class
class Database {
  constructor() {
    this.sequelize = sequelize;
  }

  async connect() {
    try {
      await this.sequelize.authenticate();
      logger.info("PostgreSQL connection established successfully");

      if (env === "dev") {
        // Load all SQL models before sync
        require("../models/sql");
        
        await this.sequelize.sync({ alter: false, logging: false });
        logger.debug("Database synced - tables ready");
      }

      return this.sequelize;
    } catch (error) {
      logger.error("Unable to connect to PostgreSQL:", error.message);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.sequelize.close();
      logger.info("PostgreSQL connection closed");
    } catch (error) {
      logger.error("Error closing PostgreSQL connection:", error);
      throw error;
    }
  }

  getSequelize() {
    return this.sequelize;
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceDatabase = Database.getInstance();

// Export both the singleton instance and the raw sequelize reference
module.exports = instanceDatabase;
module.exports.sequelize = sequelize;
