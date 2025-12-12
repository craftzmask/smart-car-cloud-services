"use strict";

const {OK} = require("../core/success.response");
const IoTDevice = require("../models/sql/iotDevice.model");
const CarService = require("../services/car.service");
const Car = require("../models/sql/car.model");
const AlertService = require("../services/alert.service");
const {
  mapAlertStatus,
  mapDeviceStatus,
  mapSeverityToThreeLevels,
  mapCarStatus,
  toPlain,
} = require("../services/status.helper");

class IotDashboardController {
    async getDevices(request, response) {
        const userId = request.user?.id || request.query.userId;
        const role = request.user?.role;
        const carId = request.query.carId;
        const isIotTeam = role === "iot_team";
        const scopedUserId = isIotTeam ? undefined : userId;

        const carsResult = await CarService.getCars({userId: scopedUserId});
        const cars = toPlain(carsResult?.cars).map((c) => ({
            ...c,
            status: mapCarStatus(c.status),
        }));

        const where = {};
        if (scopedUserId) where.userId = scopedUserId;
        if (carId) where.carId = carId;

        const devicesRaw = await IoTDevice.findAll({where, raw: true});
        const devices = devicesRaw.map((d) => ({
            ...d,
            status: mapDeviceStatus(d.status),
        }));

        const alertsResult = await AlertService.getAlerts({
            userId: scopedUserId,
        });
        const alerts = toPlain(alertsResult?.alerts).map((a) => ({
            ...a,
            severity: mapSeverityToThreeLevels(a.severity),
            status: mapAlertStatus(a.status),
        }));

        return new OK({
            message: "IoT dashboard fetched",
            data: {devices, cars, alerts},
        }).send(response);
    }

    async refresh(request, response) {
        return this.getDevices(request, response);
    }

    async createDevice(req, res) {
        const {
            carId,
            deviceType,
            deviceName,
            status,
            manufacturer,
            model,
            serialNumber,
            configuration,
        } = req.body || {};

        if (!carId || !deviceType || !deviceName) {
            return res.status(400).json({message: "carId, deviceType, deviceName are required"});
        }

        const car = await Car.findByPk(carId);
        if (!car) {
            return res.status(404).json({message: "Car not found"});
        }

        const statusToStore = String(status || "online").toLowerCase();
        const typeNormalized = String(deviceType || "audio").toLowerCase();
        const deviceTypeToStore = typeNormalized;
        const serialToStore =
            serialNumber && String(serialNumber).trim().length > 0
                ? String(serialNumber).trim()
                : `SN-${Date.now()}`;
        const device = await IoTDevice.create({
            carId,
            userId: car.userId,
            deviceType: deviceTypeToStore,
            deviceName,
            status: statusToStore,
            manufacturer,
            model,
            serialNumber: serialToStore,
            configuration: configuration || {},
        });

        return new OK({
            message: "IoT device created",
            data: {...device.toJSON(), status: mapDeviceStatus(device.status)},
        }).send(res);
    }

    async updateDevice(req, res) {
        const {id} = req.params;
        const updates = req.body || {};
        const device = await IoTDevice.findByPk(id);
        if (!device) {
            return res.status(404).json({message: "Device not found"});
        }

        if (updates.carId) {
            const car = await Car.findByPk(updates.carId);
            if (!car) {
                return res.status(404).json({message: "Target car not found"});
            }
            device.carId = updates.carId;
            device.userId = car.userId;
        }

        if (updates.deviceType) device.deviceType = String(updates.deviceType).toLowerCase();
        if (updates.deviceName) device.deviceName = updates.deviceName;
        if (updates.status) device.status = String(updates.status).toLowerCase();
        if (updates.manufacturer !== undefined) device.manufacturer = updates.manufacturer;
        if (updates.model !== undefined) device.model = updates.model;
        if (updates.serialNumber !== undefined) device.serialNumber = updates.serialNumber;
        if (updates.configuration !== undefined) device.configuration = updates.configuration;

        await device.save();

        return new OK({
            message: "IoT device updated",
            data: {...device.toJSON(), status: mapDeviceStatus(device.status)},
        }).send(res);
    }

    async deleteDevice(req, res) {
        const {id} = req.params;
        const device = await IoTDevice.findByPk(id);
        if (!device) {
            return res.status(404).json({message: "Device not found"});
        }
        await device.destroy();
        return new OK({message: "IoT device deleted", data: {id}}).send(res);
    }
}

module.exports = new IotDashboardController();
