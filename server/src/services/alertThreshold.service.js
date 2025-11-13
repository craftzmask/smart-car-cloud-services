"use strict";

const AlertThreshold = require("../models/sql/alertThreshold.model");
const AlertType = require("../models/sql/alertType.model"); // to pre-check FK existence


function toPlain(thresholdInstance) {
    if (!thresholdInstance) return null;
    const obj = thresholdInstance.toJSON();
    obj.minThreshold = parseFloat(obj.minThreshold);
    return obj;
}

module.exports = {

    async list({limit = 50, offset = 0, order = [["alertType", "ASC"]]} = {}) {
        const rows = await AlertThreshold.findAll({limit, offset, order});
        return rows.map(toPlain);
    },


    async getById(id) {
        const row = await AlertThreshold.findByPk(id);
        return toPlain(row);
    },


    async getByType(alertType) {
        const row = await AlertThreshold.findByAlertType(alertType);
        return toPlain(row);
    },


    async create({alertType, minThreshold}) {
        // 1) Presence checks
        if (!alertType || typeof alertType !== "string") {
            throw Object.assign(new Error("alertType is required"), {status: 400});
        }
        // 2) Normalize alertType to match FK (lowercase/trim)
        const normalizedType = alertType.toLowerCase().trim();

        // 3) Number and range validation for minThreshold
        const value = Number(minThreshold);
        if (!Number.isFinite(value)) {
            throw Object.assign(new Error("minThreshold must be a number"), {status: 400});
        }
        if (value < 0 || value > 1) {
            throw Object.assign(new Error("minThreshold must be between 0 and 1"), {status: 400});
        }

        // 4) Optional: pre-check FK for a nicer error than a raw FK violation
        const typeExists = await AlertType.findByPk(normalizedType);
        if (!typeExists) {
            throw Object.assign(new Error(`Unknown alertType '${normalizedType}'`), {status: 400});
        }

        try {
            const created = await AlertThreshold.create({
                alertType: normalizedType,
                minThreshold: value,
            });
            return toPlain(created);
        } catch (err) {
            // 5) Friendly error mapping
            if (err.name === "SequelizeUniqueConstraintError") {
                // unique on alertType — 1:1 design
                err.status = 409;
                err.message = `Threshold for alertType '${normalizedType}' already exists`;
            } else if (err.name === "SequelizeForeignKeyConstraintError") {
                err.status = 400;
                err.message = `Invalid alertType '${normalizedType}'`;
            } else if (err.name === "SequelizeValidationError") {
                err.status = 400;
            }
            throw err;
        }
    },


    async updateById(id, {alertType, minThreshold} = {}) {
        const row = await AlertThreshold.findByPk(id);
        if (!row) {
            throw Object.assign(new Error("AlertThreshold not found"), {status: 404});
        }

        // Normalize & validate inputs if provided
        if (alertType !== undefined) {
            if (!alertType || typeof alertType !== "string") {
                throw Object.assign(new Error("alertType must be a non-empty string"), {status: 400});
            }
            const normalizedType = alertType.toLowerCase().trim();
            // optional FK pre-check
            const typeExists = await AlertType.findByPk(normalizedType);
            if (!typeExists) {
                throw Object.assign(new Error(`Unknown alertType '${normalizedType}'`), {status: 400});
            }
            row.alertType = normalizedType;
        }

        if (minThreshold !== undefined) {
            const value = Number(minThreshold);
            if (!Number.isFinite(value)) {
                throw Object.assign(new Error("minThreshold must be a number"), {status: 400});
            }
            if (value < 0 || value > 1) {
                throw Object.assign(new Error("minThreshold must be between 0 and 1"), {status: 400});
            }
            row.minThreshold = value;
        }

        try {
            await row.save();
            return toPlain(row);
        } catch (err) {
            if (err.name === "SequelizeUniqueConstraintError") {
                err.status = 409;
                err.message = `Threshold for alertType '${row.alertType}' already exists`;
            } else if (err.name === "SequelizeForeignKeyConstraintError") {
                err.status = 400;
                err.message = `Invalid alertType '${row.alertType}'`;
            } else if (err.name === "SequelizeValidationError") {
                err.status = 400;
            }
            throw err;
        }
    },

    /**
     * Delete by id
     */
    async deleteById(id) {
        const count = await AlertThreshold.destroy({where: {id}});
        return {deleted: count > 0};
    },

};
