"use strict";

const {Op} = require("sequelize");
const Subscription = require("../models/sql/subscription.model");
const NotificationType = require("../models/sql/notificationType.model");
const AlertType = require("../models/sql/alertType.model"); // Import AlertType model
const User = require("../models/sql/user.model");
const ServiceConfigurationService = require("./serviceConfiguration.service");
const {BadRequestError, NotFoundError, ConflictRequestError} = require("../core/error.response");
const logger = require("../utils/logger");

class SubscriptionService {

    async getSubscriptions(filter = {}) {
        try {
            const {
                userId,
                alertType,
                page = 1,
                limit = 10,
                sortBy = "createdAt",
                sortOrder = "DESC",
            } = filter;

            const where = {};

            if (userId) {
                where.userId = userId;
            }

            if (alertType) {
                where.alertTypes = {
                    [Op.contains]: [alertType]
                };
            }

            const offset = (parseInt(page) - 1) * parseInt(limit);

            const {count, rows} = await Subscription.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [[sortBy, sortOrder]],
            });

            if (rows.length === 0) {
                return {
                    subscriptions: [],
                    pagination: {
                        total: 0,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        totalPages: 0,
                    },
                };
            }

            const allNotificationIds = new Set();
            rows.forEach(sub => {
                if (Array.isArray(sub.notificationTypes)) {
                    sub.notificationTypes.forEach(id => allNotificationIds.add(id));
                }
            });

            const notificationTypeMap = new Map();
            if (allNotificationIds.size > 0) {
                const types = await NotificationType.findAll({
                    where: {
                        id: {[Op.in]: Array.from(allNotificationIds)}
                    },
                    attributes: ["id", "type"]
                });

                types.forEach(t => notificationTypeMap.set(t.id, t.type));
            }

            const plainSubscriptions = rows.map(sub => {
                const json = sub.toJSON();

                if (Array.isArray(json.notificationTypes)) {
                    json.notificationTypes = json.notificationTypes
                        .map(id => notificationTypeMap.get(id))
                        .filter(Boolean);
                } else {
                    json.notificationTypes = [];
                }

                return json;
            });

            return {
                subscriptions: plainSubscriptions,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit),
                },
            };

        } catch (error) {
            logger.error("Error fetching subscriptions:", error);
            throw error;
        }
    }

    async getSubscriptionById(subscriptionId) {
        if (!subscriptionId) {
            throw new BadRequestError("Subscription ID is required");
        }

        try {
            const subscription = await Subscription.findByPk(subscriptionId);

            if (!subscription) {
                throw new NotFoundError("Subscription not found");
            }

            const subJson = subscription.toJSON();

            if (Array.isArray(subJson.notificationTypes) && subJson.notificationTypes.length > 0) {
                const types = await NotificationType.findAll({
                    where: {
                        id: {[Op.in]: subJson.notificationTypes}
                    },
                    attributes: ["type"]
                });

                subJson.notificationTypes = types.map(t => t.type);
            } else {
                subJson.notificationTypes = [];
            }

            return subJson;

        } catch (error) {
            logger.error(`Error fetching subscription ${subscriptionId}:`, error);
            throw error;
        }
    }

    async createSubscription(payload) {
        const {userId, notificationTypes, alertTypes, planId, planName, pricePerMonth} = payload;

        if (!userId) {
            throw new BadRequestError("User ID is required");
        }

        const user = await User.findByPk(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        const existing = await Subscription.findByUser(userId);
        if (existing) {
            throw new ConflictRequestError("User already has a subscription");
        }

        let notificationTypeIds = [];
        if (notificationTypes && notificationTypes.length > 0) {
            const normalizedTypes = notificationTypes.map(t => String(t).toLowerCase().trim());

            const types = await NotificationType.findAll({
                where: {
                    type: {[Op.in]: normalizedTypes}
                }
            });

            if (types.length !== normalizedTypes.length) {
                throw new BadRequestError("One or more invalid notification types provided");
            }
            notificationTypeIds = types.map(t => t.id);
        }

        if (alertTypes && alertTypes.length > 0) {
            const normalizedAlerts = alertTypes.map(t => String(t).toLowerCase().trim());

            const validAlerts = await AlertType.findAll({
                where: {
                    type: {[Op.in]: normalizedAlerts}
                },
                attributes: ['type']
            });

            if (validAlerts.length !== normalizedAlerts.length) {
                const foundTypes = new Set(validAlerts.map(a => a.type));
                const invalid = normalizedAlerts.filter(t => !foundTypes.has(t));
                throw new BadRequestError(`Invalid alert types: ${invalid.join(", ")}`);
            }
        }

        try {
            const subscription = await Subscription.create({
                userId,
                notificationTypes: notificationTypeIds,
                alertTypes: alertTypes || [],
                planId: planId || null,
                planName: planName || null,
                pricePerMonth: pricePerMonth ?? null,
            });

            logger.info(`Subscription created for user ${userId}`);

            await ServiceConfigurationService.createFromSubscription(subscription.id);

            return await this.getSubscriptionById(subscription.id);

        } catch (error) {
            logger.error("Error creating subscription:", error);
            throw error;
        }
    }

    async updateSubscription(subscriptionId, updates) {
        if (!subscriptionId) {
            throw new BadRequestError("Subscription ID is required");
        }
        if (!updates || Object.keys(updates).length === 0) {
            throw new BadRequestError("Update payload cannot be empty");
        }

        const subscription = await Subscription.findByPk(subscriptionId);
        if (!subscription) {
            throw new NotFoundError("Subscription not found");
        }

        if (updates.planId !== undefined) {
            subscription.planId = updates.planId;
        }
        if (updates.planName !== undefined) {
            subscription.planName = updates.planName;
        }
        if (updates.pricePerMonth !== undefined) {
            subscription.pricePerMonth = updates.pricePerMonth;
        }

        if (updates.notificationTypes) {
            const notificationTypes = Array.isArray(updates.notificationTypes)
                ? updates.notificationTypes
                : [updates.notificationTypes];

            const normalizedTypes = notificationTypes.map(t => String(t).toLowerCase().trim());

            const types = await NotificationType.findAll({
                where: {type: {[Op.in]: normalizedTypes}}
            });

            if (types.length !== normalizedTypes.length) {
                throw new BadRequestError("One or more invalid notification types provided for update");
            }

            subscription.notificationTypes = types.map(t => t.id);
        }

        if (updates.alertTypes) {
            const alertTypes = Array.isArray(updates.alertTypes)
                ? updates.alertTypes
                : [updates.alertTypes];

            const normalizedAlerts = alertTypes.map(t => String(t).toLowerCase().trim());

            const validAlerts = await AlertType.findAll({
                where: {type: {[Op.in]: normalizedAlerts}},
                attributes: ['type']
            });

            if (validAlerts.length !== normalizedAlerts.length) {
                const foundTypes = new Set(validAlerts.map(a => a.type));
                const invalid = normalizedAlerts.filter(t => !foundTypes.has(t));
                throw new BadRequestError(`Invalid alert types for update: ${invalid.join(", ")}`);
            }

            subscription.alertTypes = alertTypes;
        }

        try {
            await subscription.save();
            logger.info(`Subscription ${subscriptionId} updated.`);

            await ServiceConfigurationService.createFromSubscription(subscription.id);

            return await this.getSubscriptionById(subscription.id);
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const msg = error.errors.map(e => e.message).join(', ');
                throw new BadRequestError(`Validation failed: ${msg}`);
            }
            logger.error(`Error updating subscription ${subscriptionId}:`, error);
            throw error;
        }
    }

    async deleteSubscription(subscriptionId) {
        if (!subscriptionId) {
            throw new BadRequestError("Subscription ID is required");
        }

        try {
            const subscription = await Subscription.findByPk(subscriptionId);
            if (!subscription) {
                throw new NotFoundError("Subscription not found");
            }

            const userId = subscription.userId;

            try {
                await ServiceConfigurationService.deleteConfiguration(userId);
                logger.info(`Associated service configuration deleted for user ${userId}.`);
            } catch (error) {
                if (error instanceof NotFoundError) {
                    logger.warn(`Service configuration for user ${userId} not found during subscription deletion.`);
                } else {
                    logger.error(`Failed to delete associated service configuration for user ${userId}:`, error);
                }
            }
            
            await subscription.destroy();
            logger.info(`Subscription ${subscriptionId} deleted successfully for user ${userId}.`);

            return {deleted: true, subscriptionId, userId};

        } catch (error) {
            if (error instanceof NotFoundError || error instanceof BadRequestError) {
                throw error;
            }
            logger.error(`Error deleting subscription ${subscriptionId}:`, error);
            throw error;
        }
    }
}

module.exports = new SubscriptionService();
