"use strict";

// Shared schema options for Mongoose collections
module.exports = {
  timestamps: true, // adds createdAt/updatedAt
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
    },
  },
  toObject: { virtuals: true },
};

