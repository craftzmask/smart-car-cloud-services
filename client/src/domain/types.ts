// ---- User ----
export type UserRole = "CAR_OWNER" | "CLOUD_STAFF" | "IOT_TEAM";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  username?: string;
  cognitoUsername?: string;
}

// ---- CAR ----
export type CarStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";

export interface Car {
  id: string;
  ownerId: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  status: CarStatus;
  createdAt: string;
}

// ---- Car location / tracking ----
export interface CarLocation {
  carId: string;
  latitude: number;
  longitude: number;
  lastSeenAt: string;
}

// ---- IoT Device ----
export type DeviceType = "MICROPHONE" | "CAMERA" | "AUDIO";
export type DeviceStatus = "ONLINE" | "OFFLINE" | "ERROR";

export interface IoTDevice {
  id: string;
  carId: string;
  deviceType: DeviceType;
  deviceName: string;
  status: DeviceStatus;
  createdAt: string;
}

// ---- Alerts ----
export type AlertSeverity = "INFO" | "WARN" | "CRITICAL";
export type AlertStatus = "NEW" | "ACKNOWLEDGED" | "RESOLVED";

export interface Alert {
  id: string;
  carId: string;
  deviceId?: string;
  type: string;
  alertType?: string;
  severity: AlertSeverity;
  status: AlertStatus;
  description?: string;
  message?: string;
  confidenceScore: number;
  createdAt: string;
  acknowledgedAt?: string;
}

// ---- Intelligence services ----
export type IntelligenceServiceKey =
  | "OUTSIDE_NOISE"
  | "INSIDE_NOISE"
  | "PASSENGER_SOUND"
  | "ANIMAL_SOUND"
  | "ENGINE_ANOMALY"
  | "COLLISION_SOUND";

export interface CarServiceConfig {
  carId: string;
  services: {
    key: IntelligenceServiceKey;
    label: string;
    description: string;
    enabled: boolean;
  }[];
}

// ---- Notifications & Subscription ----
export type NotificationChannelKey = "EMAIL" | "SMS" | "PUSH";

export interface NotificationPreference {
  channel: NotificationChannelKey;
  label: string;
  description: string;
  enabled: boolean;
}

// --- Plans ----
export type PlanId = "BASIC" | "STANDARD" | "PREMIUM";

export interface OwnerSubscription {
  planId: PlanId;
  planName: string;
  pricePerMonth: number;
  renewalDate: string;
  notificationPreferences: NotificationPreference[];
}

// ---- AI Models ----
export type AiModeStatus = "RUNNING" | "TRAINING" | "OFFLINE";

export type DeploymentStage = "PRODUCTION" | "STAGING" | "ARCHIVED";

export interface AiModel {
  id: string;
  name: string;
  type: string;
  version: string;
  status: AiModeStatus;
  updatedAt: string;
  accuracy: number; // e.g. 94.2
  deploymentStage: DeploymentStage;
  results?: any[];
}

export type AlertCategory =
  | "SAFETY"
  | "SECURITY"
  | "MAINTENANCE"
  | "ANIMAL"
  | "PASSENGER"
  | "UNKNOWN";

export interface AlertTypeDef {
  id?: string;
  key?: string;
  type?: string;
  name?: string;
  category?: AlertCategory | "UNKNOWN";
  defaultSeverity?: "INFO" | "WARN" | "CRITICAL";
  description?: string;
  enabled?: boolean;
}

// ---- Owner Dashboard aggregate ----
export interface OwnerDashboardData {
  owner: User;
  cars: Car[];
  alerts: Alert[];
  devices: IoTDevice[];
  carServiceConfigs: CarServiceConfig[];
  subscription: OwnerSubscription;
  carLocations: CarLocation[];
  aiModels: AiModel[];
  alertTypes: AlertTypeDef[];
}
