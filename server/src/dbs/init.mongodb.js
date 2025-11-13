"use strict";

const mongoose = require("mongoose");
const config = require("../config/config.mongodb");
const logger = require("../utils/logger");

// Mongoose/MongoDB connection manager
// Lazily connects on instantiation; exposes disconnect and health helpers.

class Database {
  constructor() {
    this.isConnected = false;
    this.connect();
  }

  async connect(type = "mongodb") {
    try {
      if (process.env.NODE_ENV === "dev") {
        mongoose.set("debug", true);
        mongoose.set("debug", { color: true });
      }
      console.log(config.db.uri);
      await mongoose.connect(config.db.uri, config.db.options);

      this.isConnected = true;
      logger.info("MongoDB connected successfully");
      logger.debug(`URI: ${this.maskPassword(config.db.uri)}`);

      // Handle connection events
      mongoose.connection.on("connected", () => {
        logger.debug("MongoDB connection established");
      });

      mongoose.connection.on("error", (err) => {
        logger.error("MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        logger.warn("MongoDB disconnected");
        this.isConnected = false;
      });

      // Graceful shutdown
      process.on("SIGINT", async () => {
        await mongoose.connection.close();
        logger.warn("MongoDB connection closed through app termination");
        process.exit(0);
      });
    } catch (error) {
      this.isConnected = false;
      logger.error("MongoDB connection failed:", error.message);
      logger.warn("Retrying MongoDB connection in 5 seconds...");
      setTimeout(() => this.connect(type), 5000);
    }
  }

  async disconnect() {
    try {
      await mongoose.connection.close();
      this.isConnected = false;
      logger.info("MongoDB disconnected successfully");
    } catch (error) {
      logger.error("MongoDB disconnection error:", error);
      throw error;
    }
  }

  getConnection() {
    return mongoose.connection;
  }

  isConnectedToDB() {
    return this.isConnected;
  }

  // Helper to mask password in connection string for logging
  maskPassword(uri) {
    try {
      return uri.replace(/:([^:@]+)@/, ":****@");
    } catch {
      return uri;
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
