"use strict";

function mapStatusToUpper(value, fallback) {
  if (!value) return fallback;
  return String(value).toUpperCase();
}

function mapCarStatus(status) {
  return mapStatusToUpper(status, "UNKNOWN");
}

function mapDeviceStatus(status) {
  return mapStatusToUpper(status, "UNKNOWN");
}

function mapAlertStatus(status) {
  return mapStatusToUpper(status, "UNKNOWN");
}

function mapSeverityToThreeLevels(severity) {
  const s = String(severity || "").toLowerCase();
  if (s === "critical") return "CRITICAL";
  if (s === "high" || s === "medium" || s === "warn") return "WARN";
  return "INFO";
}

function toPlain(value) {
  if (!value) return [];
  const toJson = (item) =>
    item && typeof item.toJSON === "function" ? item.toJSON() : item;
  return Array.isArray(value) ? value.map(toJson) : [toJson(value)];
}

module.exports = {
  mapCarStatus,
  mapDeviceStatus,
  mapAlertStatus,
  mapSeverityToThreeLevels,
  toPlain,
};
