"use strict";

const process = require("process");

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3000,
  },
  db: {
    uri: process.env.DEV_MONGODB_URI || 
         `mongodb://${process.env.DEV_MONGODB_USER || 'admin'}:${process.env.DEV_MONGODB_PASSWORD || 'admin123'}@${process.env.DEV_MONGODB_HOST || 'localhost'}:${process.env.DEV_MONGODB_PORT || '27017'}/${process.env.DEV_MONGODB_NAME || 'dev'}?authSource=admin`,
    options: {
      // Mongoose connection options
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },
};

const prod = {
  app: {
    port: process.env.PROD_APP_PORT || 3000,
  },
  db: {
    // For production: MongoDB Atlas or AWS DocumentDB
    uri: process.env.PROD_MONGODB_URI || 
         `mongodb://${process.env.PROD_MONGODB_HOST || 'localhost'}:${process.env.PROD_MONGODB_PORT || '27017'}/${process.env.PROD_MONGODB_NAME || 'prod'}`,
    options: {
      maxPoolSize: 50,
      minPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // For AWS DocumentDB
      ssl: process.env.PROD_MONGODB_SSL === 'true',
      tls: process.env.PROD_MONGODB_SSL === 'true',
      retryWrites: false, // DocumentDB doesn't support retryWrites
    },
  },
};

const test = {
  app: {
    port: process.env.TEST_APP_PORT || 3000,
  },
  db: {
    uri: process.env.TEST_MONGODB_URI || 
         `mongodb://localhost:27017/test`,
    options: {
      maxPoolSize: 5,
      minPoolSize: 1,
    },
  },
};

const config = { dev, prod, test };
const env = process.env.NODE_ENV || "dev";

module.exports = config[env];