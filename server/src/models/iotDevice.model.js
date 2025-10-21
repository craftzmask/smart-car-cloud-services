"use strict";

const { DataTypes, Model } = require("sequelize");
const instanceDatabase = require("../dbs/init.database");
const { DEVICE_STATUS } =  require("../types/enums");

class IoTDevice extends Model {
  async setOnline() {
    this.status = DEVICE_STATUS.ONLINE;
    await this.save();
    return this;
  }

  async setOffline() {
    this.status = DEVICE_STATUS.OFFLINE;
    await this.save();
    return this;
  }

  async setError() {
    this.status = DEVICE_STATUS.ERROR;
    await this.save();
    return this;
  }

  async setMaintenance() {
    this.status = DEVICE_STATUS.MAINTENANCE;
    await this.save();
    return this;
  }

  updateConfiguration(config) {
    this.configuration = {
      ...this.configuration,
      ...config,
    };
    return this.save();
  }
}

IoTDevice.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    deviceType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "device_type",
      references: {
        model: "iot_device_types",
        key: "type",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    deviceName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "device_name",
    },
    manufacturer: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    serialNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: "serial_number",
    },
    status: {
      type: DataTypes.ENUM(
        DEVICE_STATUS.ONLINE,
        DEVICE_STATUS.OFFLINE,
        DEVICE_STATUS.ERROR,
        DEVICE_STATUS.MAINTENANCE
      ),
      allowNull: false,
      defaultValue: DEVICE_STATUS.OFFLINE,
    },
    configuration: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: "Device-specific configuration in JSON format",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    carId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "car_id",
      references: {
        model: "cars",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      comment: "Which car this device is installed on",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    sequelize: instanceDatabase.getSequelize(),
    tableName: "iot_devices",
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ["serial_number"] },
      { fields: ["user_id"] },
      { fields: ["car_id"] },
      { fields: ["device_type"] },
      { fields: ["status"] },
      { fields: ["user_id", "status"] },
      { fields: ["car_id", "status"] },
    ],
  }
);

// Custom query methods
IoTDevice.findByUser = function (userId) {
  return this.findAll({ where: { userId } });
};

IoTDevice.findByCar = function (carId) {
  return this.findAll({ where: { carId } });
};

IoTDevice.findBySerialNumber = function (serialNumber) {
  return this.findOne({ where: { serialNumber } });
};

IoTDevice.findOnlineDevices = function () {
  return this.findAll({ where: { status: DEVICE_STATUS.ONLINE } });
};

IoTDevice.findByType = function (deviceType) {
  return this.findAll({ where: { deviceType } });
};

module.exports = IoTDevice;