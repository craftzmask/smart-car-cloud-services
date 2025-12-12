import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import type { Alert, IoTDevice } from "@/domain/types";
import { useCloudDashboard } from "@/features/cloud/hooks/useCloudDashboard";
import { CloudLayout } from "../components/CloudLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertSeverityBadge } from "@/components/status/AlertSeverityBadge";
import { capitalize } from "@/utils";

export function CloudOverviewPage() {
  const { data, isLoading, error } = useCloudDashboard();

  if (isLoading) return <Loading />;

  if (error || !data) return <Error error={error} />;

  const { cars, devices, alerts } = data;

  const totalCars = cars.length;
  const totalDevices = devices.length;
  const totalAlerts = alerts.length;

  const criticalAlerts = alerts.filter(
    (a: Alert) => a.severity === "CRITICAL"
  ).length;

  const warningAlerts = alerts.filter(
    (a: Alert) => a.severity === "WARN"
  ).length;

  const infoAlerts = alerts.filter((a: Alert) => a.severity === "INFO").length;

  const onlineDevices = devices.filter(
    (d: IoTDevice) => d.status === "ONLINE"
  ).length;
  const offlineDevices = devices.filter(
    (d: IoTDevice) => d.status === "OFFLINE"
  ).length;

  const recentCriticalAlerts = alerts
    .filter((a: Alert) => a.severity === "CRITICAL")
    .slice(0, 5);

  return (
    <CloudLayout>
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Cars</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{totalCars}</p>
              <p className="text-slate-500">Connected smart cars</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>IoT devices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{totalDevices}</p>
              <p className="text-slate-500">Audio / camera / edge nodes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alerts (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{totalAlerts}</p>
              <p className="text-slate-500">
                Info {infoAlerts} · Warn {warningAlerts} · Crit {criticalAlerts}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Device Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {onlineDevices}/{totalDevices}
              </p>
              <p className="text-slate-500">
                Online devices · {offlineDevices} offline
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent critical alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent critical alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {recentCriticalAlerts.length === 0 ? (
              <div className="text-slate-500">
                No critical alerts at this time.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="text-right">Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCriticalAlerts.map((alert) => {
                    const car = cars.find((c) => c.id === alert.carId);
                    if (!car) return <div>Unknow Car</div>;
                    return (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <span className="font-medium text-slate-900">
                            {car.make} {car.model}{" "}
                          </span>
                          <span className="text-slate-500">
                            (VIN: {car.vin})
                          </span>
                        </TableCell>
                        <TableCell>{capitalize(alert.type)}</TableCell>
                        <TableCell>{alert.description}</TableCell>
                        <TableCell className="text-right">
                          <AlertSeverityBadge severity={alert.severity} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </CloudLayout>
  );
}
