// "use strict";
//
// const mongoose = require("mongoose");
//
// /**
//  * AlertNotification Schema
//  * Tracks notification delivery status across different channels
//  * Stored in MongoDB for high-volume write operations
//  */
// const AlertNotificationSchema = new mongoose.Schema(
//     {
//         alertId: {
//             type: String,
//             required: true,
//             index: true,
//             comment: "References SQL alert.id (UUID as string)",
//         },
//         userId: {
//             type: String,
//             required: true,
//             index: true,
//             comment: "User who received the notification",
//         },
//         channel: {
//             type: String,
//             required: true,
//             enum: ["email", "sms", "push", "in_app"],
//             comment: "Notification delivery channel",
//         },
//         status: {
//             type: String,
//             required: true,
//             enum: ["pending", "sent", "failed", "delivered", "read"],
//             default: "pending",
//             index: true,
//             comment: "Current status of the notification",
//         },
//         recipient: {
//             type: String,
//             required: false,
//             comment: "Email address, phone number, or device token",
//         },
//         subject: {
//             type: String,
//             required: false,
//             comment: "Notification subject/title",
//         },
//         message: {
//             type: String,
//             required: false,
//             comment: "Notification message body",
//         },
//         sentAt: {
//             type: Date,
//             default: null,
//             comment: "When the notification was sent",
//         },
//         deliveredAt: {
//             type: Date,
//             default: null,
//             comment: "When the notification was delivered",
//         },
//         readAt: {
//             type: Date,
//             default: null,
//             comment: "When the notification was read by user",
//         },
//         failedAt: {
//             type: Date,
//             default: null,
//             comment: "When the notification failed",
//         },
//         error: {
//             type: {
//                 code: String,
//                 message: String,
//                 details: mongoose.Schema.Types.Mixed,
//             },
//             default: null,
//             comment: "Error information if delivery failed",
//         },
//         retryCount: {
//             type: Number,
//             default: 0,
//             min: 0,
//             max: 3,
//             comment: "Number of retry attempts",
//         },
//         metadata: {
//             type: mongoose.Schema.Types.Mixed,
//             default: {},
//             comment: "Additional metadata (provider response, etc.)",
//         },
//         expiresAt: {
//             type: Date,
//             required: false,
//             comment: "When this notification should expire",
//         },
//     },
//     {
//         timestamps: true,
//         collection: "alert_notifications",
//         toJSON: {
//             virtuals: true,
//             versionKey: false,
//             transform: (_doc, ret) => {
//                 ret.id = ret._id.toString();
//                 delete ret._id;
//                 return ret;
//             },
//         },
//         toObject: {virtuals: true},
//     }
// );
//
// // Indexes for efficient querying
// AlertNotificationSchema.index({alertId: 1, channel: 1});
// AlertNotificationSchema.index({userId: 1, status: 1});
// AlertNotificationSchema.index({status: 1, sentAt: 1});
// AlertNotificationSchema.index({createdAt: 1}, {expireAfterSeconds: 7776000}); // 90 days TTL
//
// // Instance methods
// AlertNotificationSchema.methods.markAsSent = function () {
//     this.status = "sent";
//     this.sentAt = new Date();
//     return this.save();
// };
//
// AlertNotificationSchema.methods.markAsDelivered = function () {
//     this.status = "delivered";
//     this.deliveredAt = new Date();
//     return this.save();
// };
//
// AlertNotificationSchema.methods.markAsRead = function () {
//     this.status = "read";
//     this.readAt = new Date();
//     return this.save();
// };
//
// AlertNotificationSchema.methods.markAsFailed = function (error) {
//     this.status = "failed";
//     this.failedAt = new Date();
//     this.error = {
//         code: error.code || "UNKNOWN",
//         message: error.message || "Unknown error",
//         details: error.details || null,
//     };
//     this.retryCount += 1;
//     return this.save();
// };
//
// // Static methods
// AlertNotificationSchema.statics.findByAlert = function (alertId) {
//     return this.find({alertId}).sort({createdAt: -1});
// };
//
// AlertNotificationSchema.statics.findByUser = function (userId, options = {}) {
//     const query = {userId};
//     if (options.status) query.status = options.status;
//     if (options.channel) query.channel = options.channel;
//
//     return this.find(query)
//         .sort({createdAt: -1})
//         .limit(options.limit || 50);
// };
//
// AlertNotificationSchema.statics.findPendingRetries = function (maxRetries = 3) {
//     return this.find({
//         status: "failed",
//         retryCount: {$lt: maxRetries},
//         failedAt: {$gte: new Date(Date.now() - 60 * 60 * 1000)}, // Within last hour
//     });
// };
//
// AlertNotificationSchema.statics.getDeliveryStats = function (alertId) {
//     return this.aggregate([
//         {$match: {alertId}},
//         {
//             $group: {
//                 _id: "$channel",
//                 total: {$sum: 1},
//                 sent: {
//                     $sum: {$cond: [{$eq: ["$status", "sent"]}, 1, 0]},
//                 },
//                 delivered: {
//                     $sum: {$cond: [{$eq: ["$status", "delivered"]}, 1, 0]},
//                 },
//                 failed: {
//                     $sum: {$cond: [{$eq: ["$status", "failed"]}, 1, 0]},
//                 },
//                 read: {
//                     $sum: {$cond: [{$eq: ["$status", "read"]}, 1, 0]},
//                 },
//             },
//         },
//     ]);
// };
//
// module.exports = mongoose.model("AlertNotification", AlertNotificationSchema);