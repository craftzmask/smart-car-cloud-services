"use strict"

const AlertService = require("../services/alert.service");
const {OK, CREATED} = require("../core/success.response");
const {BadRequestError} = require("../core/error.response");
const {parseArrayParam, parseIntParam} = require("../helpers/queryParser");

class AlertController {
    async create(request, response) {
        const {carId, classifiedResults, metadata, audioEventId} = request.body;
        if (!carId) {
            throw new BadRequestError("Missing carId");
        }

        const data = await AlertService.createAlert({carId, classifiedResults, metadata, audioEventId});
        return new CREATED({
            message: "Alert created successfully",
            data,
        }).send(response);
    }

    async getAlerts(request, response) {
        const {
            userId,
            carId,
            alertType,
            severity,
            status,
            startDate,
            endDate,
            page,
            limit,
            sortBy,
            sortOrder,
        } = request.query;

        const filters = {
            userId,
            carId,
            alertType,
            severity: parseArrayParam(severity),
            status: parseArrayParam(status),
            startDate,
            endDate,
            page: parseIntParam(page, 1),
            limit: parseIntParam(limit, 20),
            sortBy: sortBy || "createdAt",
            sortOrder: sortOrder || "DESC",
        };

        const result = await AlertService.getAlerts(filters);

        return new OK({
            message: "Alerts retrieved successfully",
            data: result,
        }).send(response);
    }

    async getAlert(request, response) {
        const {alertId} = request.params;
        if (!alertId) {
            throw new BadRequestError("Missing alert id");
        }

        const alert = await AlertService.getAlertById(alertId);
        return new OK({
            message: "Alert retrieved successfully",
            data: alert,
        }).send(response);
    }


    async updateStatus(request, response) {
        const {alertId} = request.params;
        let {status, comment, userId} = request.body || {};

        if (!alertId) throw new BadRequestError("alertId is required in the path");
        if (!status || typeof status !== "string") {
            throw new BadRequestError("status is required");
        }

        // Prefer authenticated principal if available
        if (!userId && request.user && request.user.id) {
            userId = request.user.id;
        }

        status = status.toLowerCase().trim();

        const updated = await AlertService.updateStatus(alertId, userId || null, status, comment || null);

        return new OK({
            message: "Alert status updated successfully",
            data: updated,
        }).send(response);
    }
}

module.exports = new AlertController();