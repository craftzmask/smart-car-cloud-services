"use strict";

const {Op} = require("sequelize");
const AlertType = require("../models/sql/alertType.model");
const {BadRequestError, NotFoundError} = require("../core/error.response");
const logger = require("../utils/logger");

const toPlain = (instance) => (instance ? instance.toJSON() : null);

module.exports = {
    /**
     * List all alert types (with optional pagination/sort)
     */
    async list({limit = 100, offset = 0, order = [["type", "ASC"]]} = {}) {
        const rows = await AlertType.findAll({limit, offset, order});
        return rows.map(toPlain);
    },

    /**
     * Get one by type (PK)
     */
    async getByType(type) {
        if (!type || typeof type !== "string") return null;
        const normalized = type.toLowerCase().trim();
        const row = await AlertType.findByPk(normalized);
        return toPlain(row);
    },

    /**
     * Create new alert type
     */
    async create({type}) {
        if (!type || typeof type !== "string" || !type.trim()) {
            throw new BadRequestError("Alert Type required");
        }
        const normalized = type.toLowerCase().trim();

        try {
            const created = await AlertType.create({type: normalized});
            return toPlain(created);
        } catch (err) {
            logger.error(err.message);
            throw err;
        }
    },

    /**
     * Rename (update primary key 'type')
     * If your FK uses ON UPDATE CASCADE, child rows update automatically.
     */
    async renameType(oldType, newType) {
        const from = oldType.toLowerCase().trim();
        const to = newType.toLowerCase().trim();

        if (from === to) {
            const existing = await AlertType.findByPk(from);
            if (!existing) throw new NotFoundError("AlertType not found");
            return existing.toJSON();
        }

        const row = await AlertType.findByPk(from);
        if (!row) throw new NotFoundError("AlertType not found");

        const conflict = await AlertType.findByPk(to);
        if (conflict) {
            throw new BadRequestError("Alert conflict");
        }

        // just update directly
        row.type = to;
        await row.save(); // if FK is ON UPDATE CASCADE, children update automatically

        return row.toJSON();
    },


    /**
     * Delete alert type
     * If FK is ON DELETE CASCADE, child rows are removed automatically.
     * If FK is RESTRICT, this will throw a FK error.
     */
    async delete(type) {
        if (!type || typeof type !== "string") {
            throw new BadRequestError("Alert Type required");
        }
        const normalized = type.toLowerCase().trim();

        try {
            const count = await AlertType.destroy({where: {type: normalized}});
            return {deleted: count > 0};
        } catch (err) {
            if (err.name === "SequelizeForeignKeyConstraintError") {
                err.status = 400;
                err.message =
                    "Cannot delete alert type because related records exist (check cascade/restrict policy)";
            }
            throw err;
        }
    },

    /**
     * Optional: search by prefix
     */
    async searchByPrefix(prefix, {limit = 50} = {}) {
        const q = (prefix || "").toLowerCase().trim();
        if (!q) return [];
        const rows = await AlertType.findAll({
            where: {type: {[Op.iLike]: `${q}%`}}, // For MySQL use Op.like
            limit,
            order: [["type", "ASC"]],
        });
        return rows.map(toPlain);
    },
};
