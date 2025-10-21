"use strict";

const { DataTypes, Model } = require("sequelize");
const instanceDatabase = require("../../dbs/init.database");
const { CAR_STATUS } =  require("../../types/enums");

class Car extends Model {
  async activate() {
    this.status = CAR_STATUS.ACTIVE;
    await this.save();
    return this;
  }

  async deactivate() {
    this.status = CAR_STATUS.INACTIVE;
    await this.save();
    return this;
  }

  async setMaintenance() {
    this.status = CAR_STATUS.MAINTENANCE;
    await this.save();
    return this;
  }
}

Car.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    vin: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: "Vehicle Identification Number",
      validate: {
        notEmpty: true,
        len: [17, 17], // VIN is always 17 characters
      },
      set(value) {
        this.setDataValue("vin", value.toUpperCase().trim());
      },
    },
    make: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "Car manufacturer (Toyota, Honda, etc.)",
    },
    model: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "Car model (Camry, Civic, etc.)",
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1900,
        max: new Date().getFullYear() + 1,
      },
    },
    registrationDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "registration_date",
    },
    status: {
      type: DataTypes.ENUM(
        CAR_STATUS.ACTIVE,
        CAR_STATUS.INACTIVE,
        CAR_STATUS.MAINTENANCE,
        CAR_STATUS.DECOMMISSIONED
      ),
      allowNull: false,
      defaultValue: CAR_STATUS.ACTIVE,
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
    tableName: "cars",
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ["vin"] },
      { fields: ["user_id"] },
      { fields: ["status"] },
      { fields: ["make", "model"] },
      { fields: ["user_id", "status"] },
    ],
  }
);

// Custom query methods
Car.findByVIN = function (vin) {
  return this.findOne({ where: { vin: vin.toUpperCase() } });
};

Car.findByOwner = function (userId) {
  return this.findAll({ where: { userId } });
};

Car.findActive = function () {
  return this.findAll({ where: { status: CAR_STATUS.ACTIVE } });
};

module.exports = Car;

