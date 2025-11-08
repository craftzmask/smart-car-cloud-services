"use strict";

const mongoose = require("mongoose");
const {ALERT_ACTIONS, ALERT_STATUS} = require("../../types/enums");

/**
 * AlertHistory Schema (MongoDB)
 * Tracks all state changes and actions on alerts
 * Optimized for high-volume append-only audit logging
 */
const AlertHistorySchema = new mongoose.Schema(
    {
        alertId: {
            type: String,
            required: true,
            index: true,
            comment: "References SQL alert.id (UUID as string)",
        },
        userId: {
            type: String,
            required: false,
            index: true,
            comment: "User who performed action (null for system actions)",
        },
        alertType: {
            type: String,
            required: true,
            index: true,
        },
        action: {
            type: String,
            required: true,
            enum: Object.values(ALERT_ACTIONS),
            index: true,
            comment: "Type of action performed",
        },
        previousStatus: {
            type: String,
            required: false,
            enum: Object.values(ALERT_STATUS),
            comment: "Status before the action",
        },
        newStatus: {
            type: String,
            required: false,
            enum: Object.values(ALERT_STATUS),
            comment: "Status after the action",
        },
        comment: {
            type: String,
            required: false,
            maxlength: 1000,
            comment: "User comment or reason for the action",
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
            comment: "Additional contextual data",
        },
        timestamp: {
            type: Date,
            required: true,
            default: Date.now,
            index: true,
            comment: "When the action occurred",
        },
    },
    {
        timestamps: false,
        collection: "alert_history",
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (_doc, ret) => {
                ret.id = ret._id.toString();
                delete ret._id;
                return ret;
            },
        },
        toObject: {virtuals: true},
    }
);

// Compound indexes for efficient querying
AlertHistorySchema.index({alertId: 1, timestamp: -1});
AlertHistorySchema.index({userId: 1, timestamp: -1});
AlertHistorySchema.index({action: 1, timestamp: -1});
AlertHistorySchema.index({alertType: 1, timestamp: -1});
AlertHistorySchema.index({timestamp: 1}, {expireAfterSeconds: 7776000});

// Instance methods
AlertHistorySchema.methods.toSimpleJSON = function () {
    return {
        id: this._id.toString(),
        action: this.action,
        previousStatus: this.previousStatus,
        newStatus: this.newStatus,
        comment: this.comment,
        timestamp: this.timestamp,
        metadata: this.metadata,
    };
};

// Static methods
AlertHistorySchema.statics.findByAlert = function (alertId, options = {}) {
    const query = {alertId};

    return this.find(query)
        .sort({timestamp: -1})
        .limit(options.limit || 100);
};

AlertHistorySchema.statics.findByUser = function (userId, options = {}) {
    const query = {userId};

    if (options.startDate || options.endDate) {
        query.timestamp = {};
        if (options.startDate) query.timestamp.$gte = new Date(options.startDate);
        if (options.endDate) query.timestamp.$lte = new Date(options.endDate);
    }

    return this.find(query)
        .sort({timestamp: -1})
        .limit(options.limit || 50);
};

AlertHistorySchema.statics.findRecentActions = function (hours = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    return this.find({
        timestamp: {$gte: since},
    }).sort({timestamp: -1});
};

AlertHistorySchema.statics.getActionStats = function (alertId) {
    return this.aggregate([
        {$match: {alertId}},
        {
            $group: {
                _id: "$action",
                count: {$sum: 1},
                lastOccurred: {$max: "$timestamp"},
            },
        },
        {$sort: {lastOccurred: -1}},
    ]);
};

AlertHistorySchema.statics.getUserActivityStats = function (userId, days = 7) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    return this.aggregate([
        {
            $match: {
                userId,
                timestamp: {$gte: since},
            },
        },
        {
            $group: {
                _id: {
                    date: {$dateToString: {format: "%Y-%m-%d", date: "$timestamp"}},
                    action: "$action",
                },
                count: {$sum: 1},
            },
        },
        {$sort: {"_id.date": -1}},
    ]);
};

module.exports = mongoose.model("AlertHistory", AlertHistorySchema);