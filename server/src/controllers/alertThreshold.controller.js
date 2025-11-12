"use strict";

const AlertThresholdService = require("../services/alertThreshold.service");
const {OK, CREATED} = require("../core/success.response");
const {BadRequestError} = require("../core/error.response");

class AlertThresholdController {

    async list(request, response) {
        const limit = request.query.limit ? parseInt(request.query.limit, 10) : undefined;
        const offset = request.query.offset ? parseInt(request.query.offset, 10) : undefined;

        const data = await AlertThresholdService.list({limit, offset});

        return new OK({
            message: "Alert thresholds retrieved successfully",
            data,
        }).send(response);
    }

    async getById(request, response) {
        const {id} = request.params;

        const data = await AlertThresholdService.getById(id);
        if (!data) {
            throw new BadRequestError("AlertThreshold not found");
        }

        return new OK({
            message: "Alert threshold retrieved successfully",
            data,
        }).send(response);
    }

    async getByType(request, response) {
        const {alertType} = request.params;

        const data = await AlertThresholdService.getByType(alertType);
        if (!data) {
            throw new BadRequestError("AlertThreshold not found");
        }

        return new OK({
            message: "Alert threshold retrieved successfully",
            data,
        }).send(response);
    }

    async create(request, response) {
        const {alertType, minThreshold} = request.body || {};

        if (!alertType) {
            throw new BadRequestError("alertType is required");
        }
        if (minThreshold == null || Number.isNaN(Number(minThreshold))) {
            throw new BadRequestError("minThreshold must be a number between 0 and 1");
        }

        const data = await AlertThresholdService.create({
            alertType,
            minThreshold: Number(minThreshold),
        });

        return new CREATED({
            message: "Alert threshold created successfully",
            data,
        }).send(response);
    }

    async update(request, response) {
        const {id} = request.params;
        const {alertType, minThreshold} = request.body || {};

        if (alertType == null && minThreshold == null) {
            throw new BadRequestError("Provide at least one field to update");
        }
        if (minThreshold !== undefined && Number.isNaN(Number(minThreshold))) {
            throw new BadRequestError("minThreshold must be a number between 0 and 1");
        }

        const data = await AlertThresholdService.updateById(id, {
            alertType,
            minThreshold: minThreshold !== undefined ? Number(minThreshold) : undefined,
        });

        return new OK({
            message: "Alert threshold updated successfully",
            data,
        }).send(response);
    }

    async patch(request, response) {
        const {id} = request.params;
        const {alertType, minThreshold} = request.body || {};

        if (minThreshold !== undefined && Number.isNaN(Number(minThreshold))) {
            throw new BadRequestError("minThreshold must be a number between 0 and 1");
        }

        const data = await AlertThresholdService.updateById(id, {
            alertType,
            minThreshold: minThreshold !== undefined ? Number(minThreshold) : undefined,
        });

        return new OK({
            message: "Alert threshold updated successfully",
            data,
        }).send(response);
    }

    async delete(request, response) {
        const {id} = request.params;

        const result = await AlertThresholdService.deleteById(id);
        if (!result.deleted) {
            throw new BadRequestError("AlertThreshold not found");
        }

        return new OK({
            message: "Alert threshold deleted successfully",
            data: result,
        }).send(response);
    }

}

module.exports = new AlertThresholdController();
