"use strict";

const { OK } = require("../core/success.response");
const CarService = require("../services/car.service");
const AlertService = require("../services/alert.service");
const SubscriptionService = require("../services/subscription.service");
const ServiceConfigurationService = require("../services/serviceConfiguration.service");
const AlertType = require("../models/sql/alertType.model");
const IoTDevice = require("../models/sql/iotDevice.model");
const CarTracking = require("../models/sql/carTracking.model");
const User = require("../models/sql/user.model");
const { Op } = require("sequelize");
const {
  mapAlertStatus,
  mapDeviceStatus,
  mapSeverityToThreeLevels,
  mapCarStatus,
  toPlain,
} = require("../services/status.helper");

async function getLatestLocations(carIds) {
  if (!carIds.length) return [];
  const rows = await CarTracking.findAll({
    where: { carId: { [Op.in]: carIds } },
    order: [["createdAt", "DESC"]],
    raw: true,
  });
  const seen = new Set();
  const latest = [];
  for (const row of rows) {
    if (seen.has(row.carId)) continue;
    seen.add(row.carId);
    latest.push({
      carId: row.carId,
      latitude: row.latitude,
      longitude: row.longitude,
      lastSeenAt: row.createdAt,
    });
  }
  return latest;
}

class OwnerDashboardController {
  async getDashboard(req, res) {
    const userId = req.query.userId || req.user?.id;

    const owner =
      userId &&
      (await User.findByPk(userId, {
        attributes: ["id", "username", "name", "email", "role", "created_at"],
        raw: true,
      }));

    const carsResult = await CarService.getCars({
      userId,
    });
    const cars = toPlain(carsResult?.cars).map((c) => ({
      ...c,
      status: mapCarStatus(c.status),
    }));
    const carIds = cars.map((c) => c.id);

    const alertsResult = await AlertService.getAlerts({
      userId,
    });
    const alerts = toPlain(alertsResult?.alerts).map((a) => ({
      ...a,
      severity: mapSeverityToThreeLevels(a.severity),
      status: mapAlertStatus(a.status),
    }));

    const devices = await IoTDevice.findAll({
      where: userId ? { userId } : undefined,
      raw: true,
    });
    const plainDevices = devices.map((d) => ({
      ...d,
      status: mapDeviceStatus(d.status),
    }));

    const subscription =
      (await SubscriptionService.getSubscriptions({ userId, limit: 1 }))
        ?.subscriptions?.[0] || null;

    const serviceConfig = userId
      ? await ServiceConfigurationService.getConfiguration(userId).catch(
          () => null
        )
      : null;

    const alertTypesRaw = await AlertType.findAll({
      raw: true,
      attributes: [
        "type",
        "name",
        "description",
        "defaultseverity",
        "category",
        "enabled",
      ],
    });
    const alertTypes = alertTypesRaw.map((t) => ({
      type: t.type,
      name: t.name,
      description: t.description,
      defaultSeverity: t.defaultseverity
        ? String(t.defaultseverity).toUpperCase()
        : "INFO",
      category: t.category ? String(t.category).toUpperCase() : "UNKNOWN",
      enabled: t.enabled ?? true,
    }));

    const carLocations = await getLatestLocations(carIds);

    const defaultSubscription = {
      planId: "BASIC",
      planName: "Basic",
      pricePerMonth: 0,
      renewalDate: "",
      notificationPreferences: [],
    };

    const responseData = {
      message: "Owner dashboard fetched",
      data: {
        owner: owner || null,
        cars,
        alerts,
        devices: plainDevices,
        carServiceConfigs: serviceConfig ? [serviceConfig] : [],
        subscription: subscription || defaultSubscription,
        carLocations,
        aiModels: [],
        alertTypes,
      },
    };

    return new OK(responseData).send(res);
  }

  async upsertDashboard(req, res) {
    const userId = req.body?.owner?.id;
    const subPayload = req.body?.subscription;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }
    if (!subPayload) {
      return res.status(400).json({ message: "Missing subscription payload" });
    }

    try {
      const existing =
        (await SubscriptionService.getSubscriptions({ userId, limit: 1 }))
          ?.subscriptions?.[0] || null;
      const updates = {
        planId: subPayload.planId,
        planName: subPayload.planName,
        pricePerMonth: subPayload.pricePerMonth,
        notificationTypes: Array.isArray(subPayload.notificationPreferences)
          ? subPayload.notificationPreferences
              .filter((p) => p && p.enabled)
              .map((p) => String(p.channel).toLowerCase())
          : undefined,
      };

      if (existing) {
        await SubscriptionService.updateSubscription(existing.id, updates);
      } else {
        await SubscriptionService.createSubscription({
          userId,
          ...updates,
          alertTypes: [],
        });
      }
    } catch (err) {
      return res.status(500).json({ message: "Failed to update subscription" });
    }

    return this.getDashboard(req, res);
  }

  async refreshDashboard(req, res) {
    return this.getDashboard(req, res);
  }
}

module.exports = new OwnerDashboardController();
