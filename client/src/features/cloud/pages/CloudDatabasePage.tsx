import { CloudLayout } from "../components/CloudLayout";
import { useOwnerDashboard } from "../../owner/hooks/useOwnerDashboard";
import type { Car, Alert, IoTDevice } from "../../../domain/types";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardAction,
} from "../../../components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "../../../components/ui/table";
import Loading from "@/components/shared/Loading";
import Error from "@/components/shared/Error";
import { CarStatusBadge } from "@/components/status/CarStatusBadge";
import { AlertStatusBadge } from "@/components/status/AlertStatusBadge";
import { AlertSeverityBadge } from "@/components/status/AlertSeverityBadge";
import { formatDate } from "@/utils";
import { useState } from "react";

export function CloudDatabasePage() {
  const ownerId = "u-owner-1";

  const { data, isLoading, error } = useOwnerDashboard(ownerId);

  if (isLoading) return <Loading />;

  if (error || !data) return <Error error={error} />;

  const cars = data.cars as Car[];
  const devices = data.devices as IoTDevice[];
  const alerts = data.alerts as Alert[];

  type SeverityFilter = "ALL" | "INFO" | "WARN" | "CRITICAL";

  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("ALL");
  const [alertSearch, setAlertSearch] = useState("");

  // Precompute counts for cars
  const carsWithCounts = cars.map((car) => {
    const carDevices = devices.filter((d) => d.carId === car.id);
    const carAlerts = alerts.filter((a) => a.carId === car.id);
    return {
      car,
      deviceCount: carDevices.length,
      alertCount: carAlerts.length,
    };
  });

  // 🔍 filter alerts for the Alerts tab
  const filteredAlerts = alerts.filter((alert) => {
    // severity filter
    if (severityFilter !== "ALL" && alert.severity !== severityFilter) {
      return false;
    }

    // text search (message, type, car, device)
    const q = alertSearch.trim().toLowerCase();
    if (!q) return true;

    const car = cars.find((c) => c.id === alert.carId);
    const device = devices.find((d) => d.id === alert.deviceId);

    const haystack = [
      alert.id,
      alert.type,
      alert.message,
      alert.severity,
      alert.status,
      alert.carId,
      alert.deviceId,
      car && car.make,
      car && car.model,
      car && car.vin,
      device && device.deviceType,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });

  return (
    <CloudLayout>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Database console</CardTitle>
          <CardDescription>
            Read-only view of core system records for cloud staff.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cars">
            <TabsList>
              <TabsTrigger value="cars" className="px-6">
                Cars
              </TabsTrigger>
              <TabsTrigger value="devices" className="px-6">
                IoT devices
              </TabsTrigger>
              <TabsTrigger value="alerts" className="px-6">
                Alerts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cars">
              <Card>
                <CardHeader>
                  <CardTitle>Cars</CardTitle>
                  <CardDescription>
                    All cars known to the platform, with aggregate device and
                    alert counts.
                  </CardDescription>
                  <CardAction>
                    Total cars:{" "}
                    <span className="font-semibold">{cars.length}</span>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Car</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>VIN</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Devices</TableHead>
                        <TableHead>Alerts</TableHead>
                        <TableHead className="text-right">Created at</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {carsWithCounts.map(
                        ({ car, deviceCount, alertCount }) => (
                          <TableRow key={car.id}>
                            <TableCell>
                              {car.make} {car.model}
                            </TableCell>
                            <TableCell>
                              {/* For now we only have one owner; later you can map ownerId → owner name */}
                              {car.ownerId}
                            </TableCell>
                            <TableCell>{car.vin}</TableCell>
                            <TableCell>
                              <CarStatusBadge status={car.status} />
                            </TableCell>
                            <TableCell>{deviceCount}</TableCell>
                            <TableCell>{alertCount}</TableCell>
                            <TableCell className="text-right">
                              {new Date(car.createdAt).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                      {carsWithCounts.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-xs text-slate-500 py-6 text-center"
                          >
                            No cars found in the database.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="devices">
              <Card>
                <CardHeader>
                  <CardTitle>IoT devices</CardTitle>
                  <CardDescription>
                    All IoT devices registered in the platform, across all cars.
                  </CardDescription>
                  <CardAction>
                    Total devices:{" "}
                    <span className="font-semibold">{devices.length}</span>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device</TableHead>
                        <TableHead>Car</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created at</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {devices.map((device) => {
                        const car = cars.find((c) => c.id === device.carId);
                        return (
                          <TableRow key={device.id}>
                            <TableCell className="text-sm font-mono text-slate-900">
                              {device.id}
                            </TableCell>
                            <TableCell className="text-sm text-slate-700">
                              {car ? (
                                <>
                                  {car.make} {car.model}{" "}
                                  <span className="text-xs text-slate-400">
                                    ({car.vin})
                                  </span>
                                </>
                              ) : (
                                <span className="text-xs text-slate-400">
                                  {device.carId}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-slate-700">
                              {device.type}
                            </TableCell>
                            <TableCell className="text-sm">
                              <span
                                className={
                                  device.status === "ONLINE"
                                    ? "text-emerald-600 text-xs font-semibold"
                                    : device.status === "MAINTENANCE"
                                    ? "text-amber-600 text-xs font-semibold"
                                    : "text-slate-500 text-xs font-semibold"
                                }
                              >
                                {device.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-slate-700">
                              {new Date(device.createdAt).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {devices.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-xs text-slate-500 py-6 text-center"
                          >
                            No IoT devices found in the database.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts">
              {/* 👇 your existing Alerts <Card> goes here */}
              <Card>
                <CardHeader>
                  <CardTitle>Alerts</CardTitle>
                  <CardDescription>
                    All alerts generated by the platform, across all cars and
                    devices.
                  </CardDescription>
                  <CardAction>
                    Total alerts:{" "}
                    <span className="font-semibold text-slate-900">
                      {alerts.length}
                    </span>
                  </CardAction>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Alert</TableHead>
                          <TableHead>Car</TableHead>
                          <TableHead>Device</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">
                            Created at
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAlerts.map((alert) => {
                          const car = cars.find((c) => c.id === alert.carId);
                          const device = devices.find(
                            (d) => d.id === alert.deviceId
                          );
                          return (
                            <TableRow key={alert.id}>
                              <TableCell>{alert.id}</TableCell>
                              <TableCell>
                                {car ? (
                                  <>
                                    {car.make} {car.model}{" "}
                                    <span>({car.vin})</span>
                                  </>
                                ) : (
                                  <span>{alert.carId}</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {device ? (
                                  <span className="font-mono text-xs">
                                    {device.id}
                                  </span>
                                ) : (
                                  <span className="text-xs text-slate-400">
                                    {alert.deviceId ?? "—"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>{alert.type}</TableCell>
                              <TableCell>
                                <AlertSeverityBadge severity={alert.severity} />
                              </TableCell>
                              <TableCell>
                                <AlertStatusBadge status={alert.status} />
                              </TableCell>
                              <TableCell className="text-right">
                                {formatDate(alert.createdAt)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {filteredAlerts.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-xs text-slate-500 py-6 text-center"
                            >
                              No alerts found in the database.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </CloudLayout>
  );
}
