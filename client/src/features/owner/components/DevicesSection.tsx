import { EmptyState } from "@/components/shared/EmptyState";
import { DeviceStatusBadge } from "@/components/status/DeviceStatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { IoTDevice } from "@/domain/types";
import { capitalize, formatDate } from "@/utils";

interface DevicesSectionProps {
  devices: IoTDevice[];
}

export function DevicesSection({ devices }: DevicesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>IoT Devices</CardTitle>
        <CardDescription>
          {devices.length === 0
            ? "No devices connected to this car"
            : `Showing ${devices.length} device${
                devices.length === 1 ? "" : "s"
              } for this car`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {devices.length === 0 ? (
          <EmptyState message="Contact to an IoT team to register devices for this vehicle" />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {devices.map((device) => (
              <Card key={device.id} className="bg-slate-50/60">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <p>{device.deviceName}</p>
                    <DeviceStatusBadge status={device.status} />
                  </CardTitle>
                  <CardDescription>
                    <p>{capitalize(device.deviceType)}</p>
                    <p className="text-sm text-slate-500 mt-2">
                      Connected since {formatDate(device.createdAt)}
                    </p>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
