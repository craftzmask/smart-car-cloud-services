"use strict";

const { OK } = require("../core/success.response");
const AlertType = require("../models/sql/alertType.model");
const CarService = require("../services/car.service");
const AlertService = require("../services/alert.service");
const IoTDevice = require("../models/sql/iotDevice.model");
const { AiModel } = require("../models/mongo");
const {
  mapSeverityToThreeLevels,
  mapAlertStatus,
  mapDeviceStatus,
  mapCarStatus,
  toPlain,
} = require("../services/status.helper");

class CloudDashboardController {
  async getOverview(request, response) {
    const carsResult = await CarService.getCars({ limit: 2000 });
    const cars = toPlain(carsResult?.cars).map((c) => ({
      ...c,
      status: mapCarStatus(c.status),
    }));

    const alertsResult = await AlertService.getAlerts({
      limit: 5000,
    });
    const alerts = toPlain(alertsResult?.alerts).map((a) => ({
      ...a,
      severity: mapSeverityToThreeLevels(a.severity),
      status: mapAlertStatus(a.status),
    }));

    const devicesRaw = await IoTDevice.findAll({ raw: true });
    const devices = devicesRaw.map((d) => ({
      ...d,
      status: mapDeviceStatus(d.status),
    }));

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

    const aiModelsDocs = await AiModel.find().sort({ updatedAt: -1 }).lean();
    const aiModels = aiModelsDocs.map((m) => ({
      id: String(m._id),
      name: m.name,
      type: m.type,
      version: m.version,
      status: m.status || "RUNNING",
      updatedAt: m.updatedAt,
      accuracy: 0,
      deploymentStage: "STAGING",
      results: Array.isArray(m.results)
        ? [...m.results].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        : [],
    }));

    return new OK({
      message: "Cloud overview fetched",
      data: {
        aiModels,
        alertTypes,
        alerts,
        cars,
        devices,
      },
    }).send(response);
  }

  async refresh(request, response) {
    return this.getOverview(request, response);
  }
}

module.exports = new CloudDashboardController();
