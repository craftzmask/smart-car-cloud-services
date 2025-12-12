import type { IotDashboardData } from "./iotDashboardApi";
import type { IoTDevice } from "@/domain/types";

export function addDevice(
  data: IotDashboardData,
  newDevice: IoTDevice
): IotDashboardData {
  return { ...data, devices: [...data.devices, newDevice] };
}

export function updateDevice(
  data: IotDashboardData,
  updated: IoTDevice
): IotDashboardData {
  return {
    ...data,
    devices: data.devices.map((device) =>
      device.id === updated.id ? updated : device
    ),
  };
}

export function deleteDevice(
  data: IotDashboardData,
  deviceId: string
): IotDashboardData {
  return {
    ...data,
    devices: data.devices.filter((device) => device.id !== deviceId),
  };
}
