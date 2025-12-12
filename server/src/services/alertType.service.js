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
        const rows = await AlertType.findAll({
            limit,
            offset,
            order,
            attributes: [
                "type",
                "name",
                "description",
                "defaultseverity",
                "category",
                "enabled",
            ],
        });
        return rows.map((r) => ({
            type: r.type,
            name: r.name,
            description: r.description,
            defaultSeverity: r.defaultseverity
                ? String(r.defaultseverity).toUpperCase()
                : null,
            category: r.category,
            enabled: r.enabled,
        }));
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
    async create({type, description, defaultSeverity, category, enabled, name}) {
        if (!type || typeof type !== "string" || !type.trim()) {
            throw new BadRequestError("Alert Type required");
        }
        const normalized = type.toLowerCase().trim();

        try {
            logger.info("Creating alert type", {
                type: normalized,
                defaultSeverity,
                category,
                enabled,
            });
            const created = await AlertType.create({
                type: normalized,
                name: name || undefined,
                description,
                defaultSeverity: defaultSeverity ? String(defaultSeverity).toUpperCase() : null,
                category,
                enabled: enabled !== undefined ? enabled : true,
            });
            return {
                type: created.type,
                name: created.name,
                description: created.description,
                defaultSeverity: created.defaultSeverity
                    ? String(created.defaultSeverity).toUpperCase()
                    : null,
                category: created.category,
                enabled: created.enabled,
            };
        } catch (err) {
            logger.error(err.message);
            throw err;
        }
    },

    /**
     * Rename (update primary key 'type')
     * If your FK uses ON UPDATE CASCADE, child rows update automatically.
     */
    async renameType(oldType, payload = {}) {
        const from = String(oldType || "").toLowerCase().trim();
        if (!from) throw new BadRequestError("type is required");

        const {
            newType,
            name,
            description,
            defaultSeverity,
            category,
            enabled,
        } = payload;

        const row = await AlertType.findByPk(from);
        if (!row) throw new NotFoundError("AlertType not found");

        // handle rename
        if (newType) {
            const to = String(newType).toLowerCase().trim();
            if (to !== from) {
                const conflict = await AlertType.findByPk(to);
                if (conflict) {
                    throw new BadRequestError("Alert conflict");
                }
                row.type = to;
            }
        }

        if (description !== undefined) row.description = description;
        if (name !== undefined) row.set("name", name);
        if (defaultSeverity !== undefined) {
            row.set("defaultSeverity", String(defaultSeverity).toUpperCase());
        }
        if (category !== undefined) row.set("category", category);
        if (enabled !== undefined) row.set("enabled", !!enabled);

        logger.info("Updating alert type", {
            from,
            newType: newType || from,
            description,
            defaultSeverity,
            category,
            enabled,
        });

        await row.save();
        logger.info("Updated alert type persisted", row.toJSON());
        const plain = row.toJSON();
        return {
            type: plain.type,
            name: plain.name,
            description: plain.description,
            defaultSeverity: plain.defaultseverity
                ? String(plain.defaultseverity).toUpperCase()
                : null,
            category: plain.category,
            enabled: plain.enabled,
        };
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
