"use strict";

// User Roles
const USER_ROLES = {
    ADMIN: "admin",
    STAFF: "staff",
    USER: "user",
    CAR_OWNER: "car_owner",
    CLOUD_TEAM: "cloud_team",
    IOT_TEAM: "iot_team",
};

// Alert Severity
const ALERT_SEVERITY = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    CRITICAL: "critical",
};

// Alert Status
const ALERT_STATUS = {
    NEW: "new",
    ACKNOWLEDGED: "acknowledged",
    IN_PROGRESS: "in_progress",
    RESOLVED: "resolved",
    DISMISSED: "dismissed",
    ESCALATED: "escalated",
    FALSE_ALERT: "false_alert",
};

// Car Status
const CAR_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    MAINTENANCE: "maintenance",
    DECOMMISSIONED: "decommissioned",
};

// IoT Device Status
const DEVICE_STATUS = {
    ONLINE: "online",
    OFFLINE: "offline",
    ERROR: "error",
    MAINTENANCE: "maintenance",
};

// IoT Device Types
const DEVICE_TYPES = {
    CAMERA: "camera",
    MICROPHONE: "microphone",
    AUDIO: "audio",
};

// Notification Types
const NOTIFICATION_TYPES = {
    EMAIL: "email",
    SMS: "sms",
    PUSH: "push",
    IN_APP: "in_app",
};

// Alert Types
const ALERT_TYPES = {
    ENGINE_WARNING: "engine_warning",
    BATTERY_LOW: "battery_low",
    TIRE_PRESSURE_LOW: "tire_pressure_low",
    COLLISION_DETECTED: "collision_detected",
    SPEED_LIMIT_EXCEEDED: "speed_limit_exceeded",
    UNAUTHORIZED_ACCESS: "unauthorized_access",
    MAINTENANCE_DUE: "maintenance_due",
    FUEL_LOW: "fuel_low",
    AIRBAG_MALFUNCTION: "airbag_malfunction",
    ABS_FAILURE: "abs_failure",
};

// Alert Actions (for history tracking)
const ALERT_ACTIONS = {
    CREATED: "created",
    ACKNOWLEDGED: "acknowledged",
    RESOLVED: "resolved",
    MARKED_FALSE: "marked_false",
};

module.exports = {
    USER_ROLES,
    ALERT_SEVERITY,
    ALERT_STATUS,
    CAR_STATUS,
    DEVICE_STATUS,
    DEVICE_TYPES,
    NOTIFICATION_TYPES,
    ALERT_TYPES,
    ALERT_ACTIONS,
};
