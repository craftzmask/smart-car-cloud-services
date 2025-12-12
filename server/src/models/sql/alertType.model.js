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
    description: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: true,
      field: "name",
    },
    defaultSeverity: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "defaultseverity",
      set(value) {
        if (value === undefined || value === null) {
          this.setDataValue("defaultSeverity", null);
          return;
        }
        this.setDataValue("defaultSeverity", String(value).toUpperCase());
      },
      get() {
        const val = this.getDataValue("defaultSeverity");
        return val ? String(val).toUpperCase() : null;
      },
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "category",
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "enabled",
    },
  },
  {
    sequelize: instanceDatabase.getSequelize(),
    tableName: "alert_types",
    timestamps: false,
  }
);

module.exports = AlertType;
