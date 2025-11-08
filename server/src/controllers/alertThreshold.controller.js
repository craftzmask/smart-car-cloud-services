"use strict";

const AlertThresholdService = require("../services/alertThreshold.service");
const {OK, CREATED} = require("../core/success.response");
const {BadRequestError} = require("../core/error.response");

class AlertThresholdController {
    // List thresholds
    /**
     * List alert thresholds
     * Protected endpoint - requires authentication
     * GET /api/v1/alert-thresholds?limit=&offset=
     */
    async list(request, response) {
        const limit = request.query.limit ? parseInt(request.query.limit, 10) : undefined;
        const offset = request.query.offset ? parseInt(request.query.offset, 10) : undefined;

        const data = await AlertThresholdService.list({limit, offset});

        return new OK({
            message: "Alert thresholds retrieved successfully",
            data,
        }).send(response);
    }

    // Get by id
    /**
     * Get alert threshold by id
     * Protected endpoint - requires authentication
     * GET /api/v1/alert-thresholds/:id
     */
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

    // Get by alertType
    /**
     * Get alert threshold by alert type
     * Protected endpoint - requires authentication
     * GET /api/v1/alert-thresholds/type/:alertType
     */
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

    // Create
    /**
     * Create alert threshold
     * Protected endpoint - requires authentication
     * POST /api/v1/alert-thresholds
     * body: { alertType: string, minThreshold: number }
     */
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

    // Update (full)
    /**
     * Update alert threshold by id (full)
     * Protected endpoint - requires authentication
     * PUT /api/v1/alert-thresholds/:id
     * body: { alertType: string, minThreshold: number }
     */
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

    // Partial update
    /**
     * Partially update alert threshold by id
     * Protected endpoint - requires authentication
     * PATCH /api/v1/alert-thresholds/:id
     * body: { alertType?: string, minThreshold?: number }
     */
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

    // Delete
    /**
     * Delete alert threshold by id
     * Protected endpoint - requires authentication
     * DELETE /api/v1/alert-thresholds/:id
     */
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

    // (Optional) Stats
    /**
     * Get thresholds statistics
     * Protected endpoint - requires authentication
     * GET /api/v1/alert-thresholds/stats
     */
    async stats(request, response) {
        const data = await AlertThresholdService.stats();

        return new OK({
            message: "Alert thresholds statistics retrieved successfully",
            data,
        }).send(response);
    }
}

module.exports = new AlertThresholdController();
