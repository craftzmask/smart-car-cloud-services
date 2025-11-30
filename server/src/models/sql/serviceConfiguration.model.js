"use strict";

const {DataTypes, Model} = require("sequelize");
const {ALERT_TYPES} = require("../../types/enums");
const instanceDatabase = require("../../dbs/init.database");

class ServiceConfiguration extends Model {
}

ServiceConfiguration.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
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
        notificationMethods: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            allowNull: true,
            defaultValue: [],
            field: "notification_methods",
            comment: "Array of notification_type IDs for methods",
        },
        alertTypes: {
            type: DataTypes.ARRAY(DataTypes.STRING(50)),
            allowNull: true,
            defaultValue: [],
            field: "alert_types",
            comment: "Array of alert_type values",
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
        tableName: "service_configurations",
        timestamps: true,
        underscored: true,
        indexes: [
            {fields: ["user_id"]},
            {unique: true, fields: ["user_id"]}, // One config per user
        ],
    }
);

// Custom methods
ServiceConfiguration.findByUser = function (userId) {
    return this.findOne({where: {userId}});
};

module.exports = ServiceConfiguration;
