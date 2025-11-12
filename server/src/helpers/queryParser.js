"use strict";

/**
 * Convert a query param (string or array) into a normalized array.
 * Examples:
 *   "new,resolved"  → ["new", "resolved"]
 *   ["new","resolved"] → ["new","resolved"]
 *   "new" → ["new"]
 *   undefined → undefined
 */
function parseArrayParam(param) {
    if (!param) return undefined;
    if (Array.isArray(param)) return param;
    if (typeof param === "string" && param.includes(",")) {
        return param.split(",").map((v) => v.trim());
    }
    return [param.trim()];
}

/**
 * Parse integer query params safely with defaults.
 * Example: ?page=2 → 2; ?page=abc → defaultValue (1)
 */
function parseIntParam(value, defaultValue = 0) {
    const num = parseInt(value, 10);
    return Number.isNaN(num) ? defaultValue : num;
}

/**
 * Parse date string safely; returns Date or undefined.
 */
function parseDateParam(value) {
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
}

module.exports = {
    parseArrayParam,
    parseIntParam,
    parseDateParam,
};
