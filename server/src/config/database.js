"use strict";

const process = require("process");

// Database configuration for different environments
module.exports = {
  development: {
    username: process.env.DEV_DB_USER || "postgres",
    password: process.env.DEV_DB_PASSWORD || "postgres",
    database: process.env.DEV_DB_NAME || "car_service_dev",
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || 5432,
    dialect: "postgres",
    // Verbose SQL logs only when explicitly enabled in dev
    logging: process.env.SEQ_LOGGING === "true" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  dev: {
    username: process.env.DEV_DB_USER || "postgres",
    password: process.env.DEV_DB_PASSWORD || "postgres",
    database: process.env.DEV_DB_NAME || "car_service_dev",
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || 5432,
    dialect: "postgres",
    logging: process.env.SEQ_LOGGING === "true" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  dev: {  // ← THÊM CẤU HÌNH CHO 'dev'
    username: process.env.DEV_DB_USER || "postgres",
    password: process.env.DEV_DB_PASSWORD || "postgres",
    database: process.env.DEV_DB_NAME || "car_service_dev",
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || 5432,
    dialect: "postgres",
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  test: {
    username: process.env.TEST_DB_USER || "postgres",
    password: process.env.TEST_DB_PASSWORD || "postgres",
    database: process.env.TEST_DB_NAME || "car_service_test",
    host: process.env.TEST_DB_HOST || "localhost",
    port: process.env.TEST_DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  production: {
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      },
    },
  },
  prod: {  // ← THÊM CẤU HÌNH CHO 'prod'
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
