import type { Alert, Car, IoTDevice } from "@/domain/types";
import { authFetch } from "@/lib/authFetch";

export interface IotDashboardData {
  cars: Car[];
  devices: IoTDevice[];
  alerts: Alert[];
}

export async function fetchIotDashboard(): Promise<IotDashboardData> {
  const res = await authFetch(`/iot/dashboard`, {
    method: "GET",
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || "Failed to load IoT dashboard");
  }

  const data = (body?.data ?? {}) as Partial<IotDashboardData>;
  console.log("[iotDashboard] fetched payload", data);
  return {
    cars: data.cars ?? [],
    devices: data.devices ?? [],
    alerts: data.alerts ?? [],
  };
}
