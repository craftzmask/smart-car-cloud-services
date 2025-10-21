"use strict";

const { DataTypes, Model } = require("sequelize");
const instanceDatabase = require("../../dbs/init.database");

class CarTracking extends Model {
  getCoordinates() {
    return {
      latitude: parseFloat(this.latitude),
      longitude: parseFloat(this.longitude),
    };
  }

  getDistance(otherLat, otherLon) {
    // Haversine formula to calculate distance
    const R = 6371; // Earth's radius in km
    const lat1 = parseFloat(this.latitude) * Math.PI / 180;
    const lat2 = otherLat * Math.PI / 180;
    const deltaLat = (otherLat - parseFloat(this.latitude)) * Math.PI / 180;
    const deltaLon = (otherLon - parseFloat(this.longitude)) * Math.PI / 180;

    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in km
  }
}

CarTracking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    carId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "car_id",
      references: {
        model: "cars",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
      validate: {
        min: -180,
        max: 180,
      },
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
      validate: {
        min: -90,
        max: 90,
      },
    },
    speed: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: "Speed in km/h",
      validate: {
        min: 0,
        max: 500,
      },
    },
    heading: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Direction in degrees (0-360)",
      validate: {
        min: 0,
        max: 360,
      },
    },
    lastSeenAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "last_seen_at",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    sequelize: instanceDatabase.getSequelize(),
    tableName: "car_tracking",
    timestamps: false, // Only createdAt, no updatedAt
    underscored: true,
    indexes: [
      { fields: ["car_id"] },
      { fields: ["last_seen_at"] },
      { fields: ["car_id", "last_seen_at"] },
      { fields: ["created_at"] },
    ],
  }
);

// Custom query methods
CarTracking.findLatestByCar = function (carId) {
  return this.findOne({
    where: { carId },
    order: [["last_seen_at", "DESC"]],
  });
};

CarTracking.findHistoryByCar = function (carId, limit = 100) {
  return this.findAll({
    where: { carId },
    order: [["last_seen_at", "DESC"]],
    limit,
  });
};

CarTracking.findByTimeRange = function (carId, startDate, endDate) {
  return this.findAll({
    where: {
      carId,
      lastSeenAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [["last_seen_at", "ASC"]],
  });
};

module.exports = CarTracking;

