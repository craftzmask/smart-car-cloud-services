"use strict";

// Sequelize models aggregation and relationships
// This module collects all SQL models and sets up associations.

const User = require("./user.model");
const Car = require("./car.model");
const Alert = require("./alert.model");
const AlertType = require("./alertType.model");
const AlertStatusEnum = require("./alertStatusEnum.model");
const CarTracking = require("./carTracking.model");
const IoTDevice = require("./iotDevice.model");
const IoTDeviceType = require("./iotDeviceType.model");
const NotificationType = require("./notificationType.model");
const Subscription = require("./subscription.model");
const ServiceConfiguration = require("./serviceConfiguration.model");


// User -> Car (One-to-Many)
User.hasMany(Car, {
  foreignKey: "userId",
  as: "cars",
  onDelete: "CASCADE",
});
Car.belongsTo(User, {
  foreignKey: "userId",
  as: "owner",
});

// User -> IoTDevice (One-to-Many)
User.hasMany(IoTDevice, {
  foreignKey: "userId",
  as: "devices",
  onDelete: "CASCADE",
});
IoTDevice.belongsTo(User, {
  foreignKey: "userId",
  as: "owner",
});

// User -> Subscription (One-to-One)
User.hasOne(Subscription, {
  foreignKey: "userId",
  as: "subscription",
  onDelete: "CASCADE",
});
Subscription.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// User -> ServiceConfiguration (One-to-One)
User.hasOne(ServiceConfiguration, {
  foreignKey: "userId",
  as: "serviceConfiguration",
  onDelete: "CASCADE",
});
ServiceConfiguration.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Car -> Alert (One-to-Many)
Car.hasMany(Alert, {
  foreignKey: "carId",
  as: "alerts",
  onDelete: "CASCADE",
});
Alert.belongsTo(Car, {
  foreignKey: "carId",
  as: "car",
});

// Car -> IoTDevice (One-to-Many)
Car.hasMany(IoTDevice, {
  foreignKey: "carId",
  as: "devices",
  onDelete: "SET NULL",
});
IoTDevice.belongsTo(Car, {
  foreignKey: "carId",
  as: "car",
});

// Car -> CarTracking (One-to-Many)
Car.hasMany(CarTracking, {
  foreignKey: "carId",
  as: "trackingHistory",
  onDelete: "CASCADE",
});
CarTracking.belongsTo(Car, {
  foreignKey: "carId",
  as: "car",
});

// Alert -> AlertType (Many-to-One)
AlertType.hasMany(Alert, {
  foreignKey: "alertType",
  as: "alerts",
  onDelete: "RESTRICT",
});
Alert.belongsTo(AlertType, {
  foreignKey: "alertType",
  as: "type",
  targetKey: "type",
});

// Alert -> AlertStatusEnum (Many-to-One)
AlertStatusEnum.hasMany(Alert, {
  foreignKey: "status",
  as: "alerts",
  onDelete: "RESTRICT",
});
Alert.belongsTo(AlertStatusEnum, {
  foreignKey: "status",
  as: "statusInfo",
  targetKey: "status",
});

// Alert -> User (acknowledged_by)
User.hasMany(Alert, {
  foreignKey: "acknowledgedBy",
  as: "acknowledgedAlerts",
  onDelete: "SET NULL",
});
Alert.belongsTo(User, {
  foreignKey: "acknowledgedBy",
  as: "acknowledger",
});

// IoTDevice -> IoTDeviceType (Many-to-One)
IoTDeviceType.hasMany(IoTDevice, {
  foreignKey: "deviceType",
  as: "devices",
  onDelete: "RESTRICT",
});
IoTDevice.belongsTo(IoTDeviceType, {
  foreignKey: "deviceType",
  as: "type",
  targetKey: "type",
});

module.exports = {
  User,
  Car,
  Alert,
  AlertType,
  AlertStatusEnum,
  CarTracking,
  IoTDevice,
  IoTDeviceType,
  NotificationType,
  Subscription,
  ServiceConfiguration,
};
