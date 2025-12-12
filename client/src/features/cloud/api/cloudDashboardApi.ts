import type {
  Alert,
  AlertTypeDef,
  Car,
  IoTDevice,
  AiModel,
} from "@/domain/types";
import { authFetch } from "@/lib/authFetch";

export interface CloudDashboardData {
  cars: Car[];
  alerts: Alert[];
  alertTypes: AlertTypeDef[];
  devices: IoTDevice[];
  aiModels: AiModel[];
}

function mapAlertType(dto: any): AlertTypeDef {
  if (!dto) return {};
  const type = dto.type || dto.key;
  return {
    id: type,
    key: type,
    type,
    name:
      dto.name ||
      dto.description ||
      (type ? type.replace(/_/g, " ") : undefined),
    description: dto.description,
    category: dto.category,
    defaultSeverity: dto.defaultSeverity,
    enabled: dto.enabled,
  };
}

export async function fetchCloudDashboard(): Promise<CloudDashboardData> {
  const res = await authFetch("/cloud/dashboard", { method: "GET" });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body?.message || "Failed to load cloud dashboard");
  }

  console.log("[cloudDashboard] raw response body:", body);
  const data = (body?.data ?? {}) as Partial<CloudDashboardData>;
  console.log("Fetched cloud dashboard data:", data);
  return {
    cars: data.cars ?? [],
    alerts: data.alerts ?? [],
    alertTypes: Array.isArray(data.alertTypes)
      ? data.alertTypes.map(mapAlertType)
      : [],
    devices: data.devices ?? [],
    aiModels: Array.isArray(data.aiModels)
      ? data.aiModels.map((m: any) => ({
          id: m.id || m._id || m.name,
          name: m.name,
          type: m.type,
          version: m.version || "v1.0.0",
          status: m.status || "RUNNING",
          updatedAt: m.updatedAt || new Date().toISOString(),
          accuracy: typeof m.accuracy === "number" ? m.accuracy : 0,
          deploymentStage: m.deploymentStage || "STAGING",
          results: m.results ?? [],
        }))
      : [],
  };
}
