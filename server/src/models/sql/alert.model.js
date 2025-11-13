"use strict";

const {DataTypes, Model} = require("sequelize");
const instanceDatabase = require("../../dbs/init.database");
const {ALERT_SEVERITY, ALERT_STATUS, ALERT_TYPES} = require("../../types/enums");


class Alert extends Model {
    async acknowledge(userId) {
        this.status = ALERT_STATUS.ACKNOWLEDGED;
        this.acknowledgedBy = userId;
        this.acknowledgedAt = new Date();
        await this.save();
        return this;
    }

    async resolve(userId) {
        this.status = ALERT_STATUS.RESOLVED;
        this.acknowledgedBy = userId;
        this.acknowledgedAt = new Date();
        await this.save();
        return this;
    }

    async escalate() {
        this.status = ALERT_STATUS.ESCALATED;
        await this.save();
        return this;
    }

    async falseAlert(userId) {
        this.status = ALERT_STATUS.FALSE_ALERT;
        this.acknowledgedBy = userId;
        this.acknowledgedAt = new Date();
        await this.save();
        return this;
    }

    async updateStatus(status) {
        this.status = status;
        await this.save();
        return this;
    }
}

Alert.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        carId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: "car_id",
            references: {
                model: "cars",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        alertType: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: "alert_type",
            references: {
                model: "alert_types",
                key: "type",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
            validate: {
                isIn: [Object.values(ALERT_TYPES)],
            },
        },
        severity: {
            type: DataTypes.ENUM(
                ALERT_SEVERITY.LOW,
                ALERT_SEVERITY.MEDIUM,
                ALERT_SEVERITY.HIGH,
                ALERT_SEVERITY.CRITICAL
            ),
            allowNull: false,
            defaultValue: ALERT_SEVERITY.MEDIUM,
        },
        confidentScore: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            field: "confident_score",
            validate: {
                min: 0.0,
                max: 1.0,
            },
            comment: "AI confidence score (0.00 - 1.00)",
        },
        status: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ALERT_STATUS.NEW,
            references: {
                model: "alert_status_enum",
                key: "status",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "Detailed alert description",
        },
        acknowledgedBy: {
            type: DataTypes.UUID,
            allowNull: true,
            field: "acknowledged_by",
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        acknowledgedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "acknowledged_at",
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
        tableName: "alerts",
        timestamps: true,
        underscored: true,
        indexes: [
            {fields: ["car_id"]},
            {fields: ["alert_type"]},
            {fields: ["status"]},
            {fields: ["severity"]},
            {fields: ["created_at"]},
            {fields: ["car_id", "status"]},
            {fields: ["car_id", "created_at"]},
            {
                name: "idx_alerts_unacknowledged",
                fields: ["car_id", "created_at"],
                where: {acknowledged_at: null},
            },
        ],
    }
);

// Custom query methods
Alert.findByCar = function (carId) {
    return this.findAll({
        where: {carId},
        order: [["created_at", "DESC"]],
    });
};

Alert.findUnacknowledged = function (carId) {
    return this.findAll({
        where: {
            carId,
            acknowledgedAt: null,
        },
        order: [["created_at", "DESC"]],
    });
};

Alert.findCritical = function () {
    return this.findAll({
        where: {
            severity: ALERT_SEVERITY.CRITICAL,
            status: [ALERT_STATUS.NEW, ALERT_STATUS.ACKNOWLEDGED],
        },
        order: [["created_at", "DESC"]],
    });
};

module.exports = Alert;
