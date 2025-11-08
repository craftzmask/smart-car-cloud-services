"use strict";

const {DataTypes, Model} = require("sequelize");
const {ALERT_TYPES} = require("../../types/enums");

class AlertThreshold extends Model {
    /**
     * Check if confidence meets this threshold
     * @param {number} confidence - Confidence score (0-1)
     * @returns {boolean}
     */
    meetsThreshold(confidence) {
        return confidence >= parseFloat(this.minThreshold);
    }
}

/**
 * Initialize AlertThreshold model
 * Simple lookup table for alert type minimum confidence thresholds
 */
AlertThreshold.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        alertType: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            field: "alert_type",
            references: {
                model: "alert_types",
                key: "type",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
            comment: "Type of alert (unique)",
            validate: {
                isIn: [Object.values(ALERT_TYPES)],
            },
        },
        minThreshold: {
            type: DataTypes.DECIMAL(5, 4),
            allowNull: false,
            field: "min_threshold",
            defaultValue: 0.5,
            comment: "Minimum confidence score required (0.0000 to 1.0000)",
            validate: {
                min: 0.0,
                max: 1.0,
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "created_at",
        },
    },
    {
        sequelize: require("../../dbs/init.database").getSequelize(),
        tableName: "alert_thresholds",
        timestamps: false,
        underscored: true,
        indexes: [
            {fields: ["alert_type"], unique: true},
        ],
    }
);

// ============================================================
// STATIC METHODS
// ============================================================

/**
 * Get all thresholds
 * @returns {Promise<Array<AlertThreshold>>}
 */
AlertThreshold.findAllThresholds = async function () {
    return await this.findAll({
        order: [["alertType", "ASC"]],
    });
};

/**
 * Get threshold for specific alert type
 * @param {string} alertType - Alert type
 * @returns {Promise<AlertThreshold|null>}
 */
AlertThreshold.findByAlertType = async function (alertType) {
    return await this.findOne({
        where: {alertType},
    });
};

/**
 * Get thresholds as a map for quick lookup
 * @returns {Promise<Map<string, number>>} Map of alertType -> minThreshold
 */
AlertThreshold.getThresholdMap = async function () {
    const thresholds = await this.findAll();
    return new Map(
        thresholds.map((t) => [t.alertType, parseFloat(t.minThreshold)])
    );
};

/**
 * Find the best alert from classification results
 * @param {Array<Object>} classifiedResults - [{type, confidence}, ...]
 * @returns {Promise<Object|null>} Best alert or null
 */
AlertThreshold.findBestAlert = async function (classifiedResults) {
    if (!Array.isArray(classifiedResults) || classifiedResults.length === 0) {
        return null;
    }

    // Get all thresholds
    const thresholdMap = await this.getThresholdMap();

    // Filter results that meet thresholds
    const validAlerts = classifiedResults
        .map((result) => {
            const threshold = thresholdMap.get(result.type);
            if (!threshold) return null;

            if (result.confidence >= threshold) {
                return {
                    type: result.type,
                    confidence: result.confidence,
                    threshold: threshold,
                };
            }
            return null;
        })
        .filter((alert) => alert !== null);

    if (validAlerts.length === 0) {
        return null;
    }

    // Sort by confidence (highest first)
    validAlerts.sort((a, b) => b.confidence - a.confidence);

    return validAlerts[0];
};

/**
 * Create or update threshold
 * @param {string} alertType - Alert type
 * @param {number} minThreshold - Minimum threshold (0-1)
 * @returns {Promise<AlertThreshold>}
 */
AlertThreshold.upsertThreshold = async function (alertType, minThreshold) {
    const [threshold, created] = await this.findOrCreate({
        where: {alertType},
        defaults: {
            alertType,
            minThreshold,
        },
    });

    if (!created) {
        threshold.minThreshold = minThreshold;
        await threshold.save();
    }

    return threshold;
};

/**
 * Bulk create or update thresholds
 * @param {Array<Object>} thresholds - Array of {alertType, minThreshold}
 * @returns {Promise<Array<AlertThreshold>>}
 */
AlertThreshold.bulkUpsert = async function (thresholds) {
    const results = [];

    for (const {alertType, minThreshold} of thresholds) {
        const threshold = await this.upsertThreshold(alertType, minThreshold);
        results.push(threshold);
    }

    return results;
};

/**
 * Check if alert type has threshold configured
 * @param {string} alertType - Alert type
 * @returns {Promise<boolean>}
 */
AlertThreshold.hasThreshold = async function (alertType) {
    const count = await this.count({where: {alertType}});
    return count > 0;
};

/**
 * Get statistics about thresholds
 * @returns {Promise<Object>}
 */
AlertThreshold.getStats = async function () {
    const thresholds = await this.findAll();

    if (thresholds.length === 0) {
        return {
            total: 0,
            averageThreshold: null,
            minThreshold: null,
            maxThreshold: null,
        };
    }

    const values = thresholds.map((t) => parseFloat(t.minThreshold));

    return {
        total: thresholds.length,
        averageThreshold: values.reduce((sum, val) => sum + val, 0) / values.length,
        minThreshold: Math.min(...values),
        maxThreshold: Math.max(...values),
    };
};

module.exports = AlertThreshold;