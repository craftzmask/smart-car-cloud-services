"use strict";

const {Op} = require("sequelize");
const Alert = require("../models/sql/alert.model");
const AlertHistory = require("../models/mongo/alertHistory.model");
const AlertThreshold = require("../models/sql/alertThreshold.model");
const AlertType = require("../models/sql/alertType.model");
const Car = require("../models/sql/car.model");
const User = require("../models/sql/user.model");
const AlertNotification = require("../models/mongo/alertNotification.model");
const {AudioEvent} = require("../models/mongo");
const {
    ALERT_STATUS,
    ALERT_ACTIONS,
    ALERT_SEVERITY,
} = require("../types/enums");
const {
    BadRequestError,
    NotFoundError,
    ForbiddenError,
} = require("../core/error.response");
const logger = require("../utils/logger");

class AlertService {

    // ============================================================
    // VALIDATION & HELPER METHODS
    // ============================================================

    // Build once at module load
    VALID_STATUSES = new Set(Object.values(ALERT_STATUS).map(s => String(s).toLowerCase()));

    normalizeStatus = (s) => String(s || "").toLowerCase().trim();

    /**
     * Check status is valid
     * @param {string} status - Alert status
     * @returns {boolean} - true or false
     */
    isValidStatus(status) {
        const normalized = this.normalizeStatus(status);
        if (!this.VALID_STATUSES.has(normalized)) {
            return false;
        }
        return true;
    }

    /**
     * Determine severity based on alert type and confidence
     * @param {string} alertType - Alert type
     * @param {number} confidence - Confidence score
     * @returns {string} Severity level
     */
    determineSeverity(alertType, confidence) {
        // Map alert types to base severity
        const severityMap = {
            collision_detected: ALERT_SEVERITY.CRITICAL,
            unauthorized_access: ALERT_SEVERITY.CRITICAL,
            airbag_malfunction: ALERT_SEVERITY.CRITICAL,
            engine_warning: ALERT_SEVERITY.HIGH,
            abs_failure: ALERT_SEVERITY.HIGH,
            battery_low: ALERT_SEVERITY.HIGH,
            tire_pressure_low: ALERT_SEVERITY.MEDIUM,
            maintenance_due: ALERT_SEVERITY.MEDIUM,
            fuel_low: ALERT_SEVERITY.LOW,
            speed_limit_exceeded: ALERT_SEVERITY.LOW,
        };

        let severity = severityMap[alertType] || ALERT_SEVERITY.MEDIUM;

        // Upgrade severity if confidence is very high
        if (confidence >= 0.95) {
            if (severity === ALERT_SEVERITY.HIGH) {
                severity = ALERT_SEVERITY.CRITICAL;
            } else if (severity === ALERT_SEVERITY.MEDIUM) {
                severity = ALERT_SEVERITY.HIGH;
            }
        }

        return severity;
    }

    /**
     * Get date filter from time range
     * @param {string} timeRange - Time range (7d, 30d, 90d, 1y)
     * @returns {Object} Sequelize date filter
     */
    getDateFilterFromRange(timeRange) {
        const now = new Date();
        let startDate;

        switch (timeRange) {
            case "7d":
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "30d":
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case "90d":
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case "1y":
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        return {[Op.gte]: startDate};
    }

    /**
     * Calculate response time metrics
     * @param {Array<string>} carIds - Array of car UUIDs
     * @param {Object} dateFilter - Date filter
     * @returns {Promise<Object>}
     */
    async calculateResponseMetrics(carIds, dateFilter) {
        try {
            const where = {carId: {[Op.in]: carIds}};
            if (dateFilter) {
                where.createdAt = dateFilter;
            }

            const resolvedAlerts = await Alert.findAll({
                where: {
                    ...where,
                    status: ALERT_STATUS.RESOLVED,
                    acknowledgedAt: {[Op.ne]: null},
                },
                attributes: ["createdAt", "acknowledgedAt", "updatedAt"],
                raw: true,
            });

            if (resolvedAlerts.length === 0) {
                return {
                    averageAcknowledgeTime: null,
                    averageResolveTime: null,
                    count: 0,
                };
            }

            // Calculate times in milliseconds
            const acknowledgeTimes = [];
            const resolveTimes = [];

            resolvedAlerts.forEach((alert) => {
                const ackTime = new Date(alert.acknowledgedAt) - new Date(alert.createdAt);
                const resolveTime = new Date(alert.updatedAt) - new Date(alert.acknowledgedAt);

                if (ackTime > 0) acknowledgeTimes.push(ackTime);
                if (resolveTime > 0) resolveTimes.push(resolveTime);
            });

            const avgAckTime =
                acknowledgeTimes.length > 0
                    ? acknowledgeTimes.reduce((a, b) => a + b, 0) / acknowledgeTimes.length
                    : null;

            const avgResolveTime =
                resolveTimes.length > 0
                    ? resolveTimes.reduce((a, b) => a + b, 0) / resolveTimes.length
                    : null;

            return {
                averageAcknowledgeTime: avgAckTime ? Math.round(avgAckTime / 1000 / 60) : null, // minutes
                averageResolveTime: avgResolveTime ? Math.round(avgResolveTime / 1000 / 60) : null, // minutes
                count: resolvedAlerts.length,
            };
        } catch (error) {
            logger.error("Error calculating response metrics:", error);
            return {
                averageAcknowledgeTime: null,
                averageResolveTime: null,
                count: 0,
            };
        }
    }

    /**
     * Convert array to object
     * @param {Array} arr - Array of objects
     * @param {string} keyField - Key field name
     * @param {string} valueField - Value field name
     * @returns {Object}
     */
    arrayToObject(arr, keyField, valueField) {
        return arr.reduce((acc, item) => {
            acc[item[keyField]] = parseInt(item[valueField]);
            return acc;
        }, {});
    }

    /**
     * Get empty statistics object
     * @returns {Object}
     */
    getEmptyStatistics() {
        return {
            total: 0,
            bySeverity: {},
            byStatus: {},
            byType: [],
            responseMetrics: {
                averageAcknowledgeTime: null,
                averageResolveTime: null,
                count: 0,
            },
        };
    }

    // ============================================================
    // CREATE OPERATIONS
    // ============================================================

    /**
     * Create a new alert from ML classification results
     * @param {Object} data - Alert data
     * @param {string} data.carId - Car UUID
     * @param {Array<Object>} data.classifiedResults - ML predictions [{type, confidence}]
     * @param {Object} data.metadata - Additional metadata (optional)
     * @param {string} data.audioEventId - Audio event ID (optional)
     * @returns {Promise<Alert|null>} Created alert or null if no valid predictions
     */
    async createAlert({carId, classifiedResults, metadata = {}, audioEventId = null}) {
        try {
            // 1. Validate car exists
            const car = await Car.findByPk(carId);
            if (!car) {
                throw new NotFoundError("Car not found");
            }

            // 2. Find the best alert from classification results using database thresholds
            const bestAlert = await AlertThreshold.findBestAlert(classifiedResults);

            if (!bestAlert) {
                logger.debug(
                    `No valid alerts found for car ${carId}. Classification results:`,
                    classifiedResults
                );
                return null;
            }

            const {type: alertType, confidence, threshold} = bestAlert;

            // Determine severity based on alert type or default mapping
            const severity = this.determineSeverity(alertType, confidence);

            // 4. Check for duplicate recent alerts (within 5 minutes)
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            const recentAlert = await Alert.findOne({
                where: {
                    carId,
                    alertType,
                    createdAt: {
                        [Op.gte]: fiveMinutesAgo,
                    },
                },
            });

            if (recentAlert) {
                logger.warn(
                    `Duplicate alert detected for car ${carId}, type ${alertType}`
                );

                // Update existing alert's confidence if new one is higher
                if (confidence > recentAlert.confidentScore) {
                    recentAlert.confidentScore = confidence;
                    await recentAlert.save();
                }

                // Log the duplicate attempt
                // await this.logAlertAction(recentAlert.id, null, ALERT_ACTIONS.UPDATED, {
                //     reason: "duplicate_classification",
                //     newConfidence: confidence,
                //     allResults: classifiedResults,
                //     metadata,
                // });

                return null;
            }

            // 5. Create alert
            const alert = await Alert.create({
                carId,
                alertType,
                severity,
                confidentScore: confidence,
                description: `${alertType} detected`,
                status: ALERT_STATUS.NEW,
            });

            // 6. Log creation in history
            await this.logAlertAction(alert.id, null, alertType, ALERT_ACTIONS.CREATED, {
                newStatus: ALERT_STATUS.NEW,
                metadata,
                audioEventId,
                mlClassification: {
                    confidence,
                    allResults: classifiedResults,
                    selectedAlert: {
                        type: alertType,
                        confidence,
                        threshold,
                    },
                },
            });

            logger.info(
                `Alert created: ${alert.id} for car ${carId}, type: ${alertType}, confidence: ${confidence.toFixed(2)}, threshold: ${threshold}`
            );

            // 7. Send alert data to notification service
            logger.info("Sending alert to notification service");

            // 8. Return alert with associations
            return await Alert.findByPk(alert.id, {
                include: [
                    {model: Car, as: "car", attributes: ["id", "vin", "make", "model"]},
                    {
                        model: AlertType,
                        as: "type",
                        attributes: ["type"],
                    },
                ],
            });
        } catch (error) {
            logger.error("Error creating alert:", error);
            throw error;
        }
    }

    /**
     * Create alert from audio event
     * @param {string} audioEventId - MongoDB ObjectId
     * @returns {Promise<Alert>}
     */
    async createAlertFromAudioEvent(audioEventId) {
        try {
            // Fetch audio event from MongoDB
            const audioEvent = await AudioEvent.findById(audioEventId);
            if (!audioEvent) {
                throw new NotFoundError("Audio event not found");
            }

            // Extract alert data from audio event
            // Assuming audioEvent has mlPredictions or similar field
            const classifiedResults = audioEvent.mlPredictions || [
                {
                    type: audioEvent.eventType,
                    confidence: audioEvent.confidence || 0.5,
                },
            ];

            return await this.createAlert({
                carId: audioEvent.carId,
                classifiedResults,
                metadata: {
                    audioEventId: audioEvent.id,
                    deviceId: audioEvent.deviceId,
                    location: audioEvent.location,
                    timestamp: audioEvent.timestamp,
                },
                audioEventId: audioEvent.id,
            });
        } catch (error) {
            logger.error("Error creating alert from audio event:", error);
            throw error;
        }
    }


    // ============================================================
    // READ OPERATIONS
    // ============================================================

    /**
     * Get alert by ID
     * @param {string} alertId - Alert UUID
     * @returns {Promise<Alert>}
     */
    async getAlertById(alertId) {
        try {
            const alert = await Alert.findByPk(alertId, {
                include: [
                    {
                        model: Car,
                        as: "car",
                        attributes: ["id", "vin", "make", "model", "year"],
                    },
                    {
                        model: User,
                        as: "acknowledger",
                        attributes: ["id", "username", "email"],
                    },
                    {
                        model: AlertType,
                        as: "type",
                        attributes: ["type"],
                    },
                ],
            });

            if (!alert) {
                throw new NotFoundError("Alert not found");
            }

            return alert;
        } catch (error) {
            logger.error(`Error fetching alert ${alertId}:`, error);
            throw error;
        }
    }

    /**
     * Get alerts with filters
     * @param {Object} filters - Query filters
     * @returns {Promise<{alerts: Array<Alert>, pagination: Object}>}
     */
    async getAlerts(filters = {}) {
        try {
            const {
                userId,
                carId,
                alertType,
                severity,
                status,
                startDate,
                endDate,
                page = 1,
                limit = 20,
                sortBy = "createdAt",
                sortOrder = "DESC",
            } = filters;

            const where = {};

            // Build query conditions
            if (carId) {
                where.carId = carId;
            } else if (userId) {
                // Get user's cars
                const cars = await Car.findAll({
                    where: {userId},
                    attributes: ["id"],
                });
                if (cars.length === 0) {
                    return {alerts: [], pagination: {total: 0, page, limit, totalPages: 0}};
                }
                where.carId = {[Op.in]: cars.map((c) => c.id)};
            }

            if (alertType) {
                where.alertType = alertType;
            }

            if (severity) {
                if (Array.isArray(severity)) {
                    where.severity = {[Op.in]: severity};
                } else {
                    where.severity = severity;
                }
            }

            if (status) {
                if (Array.isArray(status)) {
                    where.status = {[Op.in]: status};
                } else {
                    where.status = status;
                }
            }

            if (startDate || endDate) {
                where.createdAt = {};
                if (startDate) where.createdAt[Op.gte] = new Date(startDate);
                if (endDate) where.createdAt[Op.lte] = new Date(endDate);
            }

            const offset = (page - 1) * limit;

            const {count, rows} = await Alert.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset,
                order: [[sortBy, sortOrder]],
                include: [
                    {
                        model: Car,
                        as: "car",
                        attributes: ["id", "vin", "make", "model"],
                    },
                    {
                        model: User,
                        as: "acknowledger",
                        attributes: ["id", "username", "email"],
                    },
                ],
            });

            return {
                alerts: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit),
                },
            };
        } catch (error) {
            logger.error("Error fetching alerts:", error);
            throw error;
        }
    }


    /**
     * Get alerts by time range
     * @param {string} carId - Car UUID
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<Array<Alert>>}
     */
    async getAlertsByTimeRange(carId, startDate, endDate) {
        try {
            return await Alert.findAll({
                where: {
                    carId,
                    createdAt: {
                        [Op.between]: [new Date(startDate), new Date(endDate)],
                    },
                },
                order: [["createdAt", "ASC"]],
            });
        } catch (error) {
            logger.error("Error fetching alerts by time range:", error);
            throw error;
        }
    }

    /**
     * Get alert statistics
     * @param {string} userId - User UUID
     * @param {string} timeRange - Time range (7d, 30d, 90d, 1y)
     * @returns {Promise<Object>}
     */
    async getAlertStatistics(userId, timeRange = "7d") {
        try {
            const cars = await Car.findAll({
                where: {userId},
                attributes: ["id"],
            });

            if (cars.length === 0) {
                return this.getEmptyStatistics();
            }

            const carIds = cars.map((c) => c.id);
            const dateFilter = this.getDateFilterFromRange(timeRange);

            const baseWhere = {
                carId: {[Op.in]: carIds},
            };

            if (dateFilter) {
                baseWhere.createdAt = dateFilter;
            }

            const [
                totalAlerts,
                alertsBySeverity,
                alertsByStatus,
                alertsByType,
                responseMetrics,
            ] = await Promise.all([
                // Total alerts
                Alert.count({where: baseWhere}),

                // By severity
                Alert.findAll({
                    where: baseWhere,
                    attributes: [
                        "severity",
                        [Alert.sequelize.fn("COUNT", Alert.sequelize.col("id")), "count"],
                    ],
                    group: ["severity"],
                    raw: true,
                }),

                // By status
                Alert.findAll({
                    where: baseWhere,
                    attributes: [
                        "status",
                        [Alert.sequelize.fn("COUNT", Alert.sequelize.col("id")), "count"],
                    ],
                    group: ["status"],
                    raw: true,
                }),

                // By type (top 10)
                Alert.findAll({
                    where: baseWhere,
                    attributes: [
                        "alertType",
                        [Alert.sequelize.fn("COUNT", Alert.sequelize.col("id")), "count"],
                    ],
                    group: ["alertType"],
                    order: [[Alert.sequelize.fn("COUNT", Alert.sequelize.col("id")), "DESC"]],
                    limit: 10,
                    raw: true,
                }),

                // Response metrics
                this.calculateResponseMetrics(carIds, dateFilter),
            ]);

            return {
                total: totalAlerts,
                timeRange,
                bySeverity: this.arrayToObject(alertsBySeverity, "severity", "count"),
                byStatus: this.arrayToObject(alertsByStatus, "status", "count"),
                byType: alertsByType.map((item) => ({
                    type: item.alertType,
                    count: parseInt(item.count),
                })),
                responseMetrics,
            };
        } catch (error) {
            logger.error("Error calculating alert statistics:", error);
            throw error;
        }
    }

    // ============================================================
    // UPDATE OPERATIONS
    // ============================================================

    /**
     * Update an alert's status
     * @param {string} alertId - Alert UUID
     * @param {string} userId - User UUID (null for system)
     * @param {string} comment - Optional comment
     * @returns {Promise<Alert>}
     */
    async updateStatus(alertId, userId = null, status, comment = null) {
        try {
            const alert = await Alert.findByPk(alertId);
            const user = await User.findByPk(userIdId);

            if (!alert) {
                throw new NotFoundError("Alert not found");
            }

            if (!user) {
                throw new NotFoundError("User not found");
            }

            if (!this.isValidStatus(status)) {
                throw new NotFoundError("Status not found");
            }

            // Check if status already set
            if (alert.status === status) {
                throw new BadRequestError("Alert status already set");
            }

            const previousStatus = alert.status;

            // Update alert
            if (status === ALERT_STATUS.ACKNOWLEDGED) {
                await alert.acknowledge(userId);
            } else {
                await alert.updateStatus(status);
            }

            let action;
            switch (status) {
                case ALERT_STATUS.ACKNOWLEDGED:
                    action = ALERT_ACTIONS.ACKNOWLEDGED;
                    break;
                case ALERT_STATUS.RESOLVED:
                    action = ALERT_ACTIONS.RESOLVED;
                    break;
                case ALERT_STATUS.FALSE_ALERT:
                    action = ALERT_ACTIONS.FALSE_ALERT;
                    break;
                default:
                    action = ALERT_ACTIONS.CREATED;
            }
            // Log history
            await this.logAlertAction(alertId, userId, action, {
                comment,
                previousStatus,
                newStatus: status,
            });

            logger.info(
                `Alert ${alertId} acknowledged by ${userId || "system"}`
            );

            return await this.getAlertById(alertId);
        } catch (error) {
            logger.error(`Error acknowledging alert ${alertId}:`, error);
            throw error;
        }
    }


    // ============================================================
    // DELETE OPERATIONS
    // ============================================================

    /**
     * Delete an alert
     * @param {string} alertId - Alert UUID
     * @returns {Promise<boolean>}
     */
    async deleteAlert(alertId) {
        try {
            const alert = await Alert.findByPk(alertId);
            if (!alert) {
                throw new NotFoundError("Alert not found");
            }

            await alert.destroy();

            // Also clean up MongoDB notifications
            await AlertNotification.deleteMany({alertId});

            logger.info(`Alert ${alertId} deleted`);
            return true;
        } catch (error) {
            logger.error(`Error deleting alert ${alertId}:`, error);
            throw error;
        }
    }

    /**
     * Bulk delete alerts
     * @param {Array<string>} alertIds - Array of alert UUIDs
     * @returns {Promise<number>} Number of deleted alerts
     */
    // async bulkDeleteAlerts(alertIds) {
    //     try {
    //         const count = await Alert.destroy({
    //             where: {
    //                 id: {[Op.in]: alertIds},
    //             },
    //         });
    //
    //         // Clean up MongoDB notifications
    //         await AlertNotification.deleteMany({
    //             alertId: {$in: alertIds},
    //         });
    //
    //         logger.info(`${count} alerts deleted in bulk operation`);
    //         return count;
    //     } catch (error) {
    //         logger.error("Error in bulk delete alerts:", error);
    //         throw error;
    //     }
    // }

    // ============================================================
    // HISTORY OPERATIONS
    // ============================================================

    /**
     * Get alert history
     * @param {string} alertId - Alert UUID
     * @returns {Promise<Array<AlertHistory>>}
     */
    async getAlertHistory(alertId) {
        try {
            return await AlertHistory.findByAlert(alertId);
        } catch (error) {
            logger.error(`Error fetching alert history for ${alertId}:`, error);
            throw error;
        }
    }

    /**
     * Log alert action
     * @param {string} alertId - Alert UUID
     * @param {string} userId - User UUID (null for system)
     * @param alertType - Alert Type
     * @param {string} action - Action type
     * @param {Object} data - Additional data
     * @returns {Promise<void>}
     */
    async logAlertAction(alertId, userId, alertType, action, data = {}) {
        try {
            await AlertHistory.create({
                alertId,
                userId,
                alertType,
                action,
                previousStatus: data.previousStatus || null,
                newStatus: data.newStatus || null,
                comment: data.comment || data.reason || null,
                metadata: data,
                timestamp: new Date(),
            });
        } catch (error) {
            logger.error("Error logging alert action:", error);
            // Don't throw, as this is a non-critical operation
        }
    }

}

module.exports = new AlertService();