import type { IoTDevice } from "@/domain/types";
import { authFetch } from "@/lib/authFetch";

export async function createIotDevice(
  payload: Omit<IoTDevice, "id">
): Promise<IoTDevice> {
  const res = await authFetch(`/iot/devices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || "Failed to create IoT device");
  }
  return body.data as IoTDevice;
}

export async function updateIotDevice(
  id: string,
  payload: Partial<IoTDevice>
): Promise<IoTDevice> {
  const res = await authFetch(`/iot/devices/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || "Failed to update IoT device");
  }
  return body.data as IoTDevice;
}

export async function deleteIotDevice(id: string): Promise<string> {
  const res = await authFetch(`/iot/devices/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || "Failed to delete IoT device");
  }
  return body.data?.id || id;
}
