"use strict";

const { DataTypes, Model } = require("sequelize");
const instanceDatabase = require("../../dbs/init.database");

class AlertType extends Model {}

AlertType.init(
  {
    type: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isLowercase: true,
      },
      set(value) {
        this.setDataValue("type", value.toLowerCase().trim());
      },
    },
  },
  {
    sequelize: instanceDatabase.getSequelize(),
    tableName: "alert_types",
    timestamps: false,
  }
);

module.exports = AlertType;

