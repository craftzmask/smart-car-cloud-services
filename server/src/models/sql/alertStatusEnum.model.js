"use strict";

const { DataTypes, Model } = require("sequelize");
const instanceDatabase = require("../../dbs/init.database");

class AlertStatusEnum extends Model {}

AlertStatusEnum.init(
  {
    status: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isLowercase: true,
      },
      set(value) {
        this.setDataValue("status", value.toLowerCase().trim());
      },
    },
  },
  {
    sequelize: instanceDatabase.getSequelize(),
    tableName: "alert_status_enum",
    timestamps: false,
  }
);

module.exports = AlertStatusEnum;

