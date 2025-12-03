import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import type { Alert, IoTDevice } from "@/domain/types";
import { useOwnerDashboard } from "@/features/owner/hooks/useOwnerDashboard";
import { CloudLayout } from "../components/CloudLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { AlertSeverityBadge } from "@/components/status/AlertSeverityBadge";
import {
  capitalize,
  filterAlertsByDays,
  getLastNDaysRangeLabel,
} from "@/utils";
import {
  Activity,
  BellRing,
  Car as CarIcon,
  TrendingUp,
  Wifi,
} from "lucide-react";
import { AlertLineChart, AlertTypeBarChart } from "@/components/shared/Chart";

export function CloudOverviewPage() {
  const ownerId = "u-owner-1";
  const { data, isLoading, error } = useOwnerDashboard(ownerId);

  if (isLoading) return <Loading />;

  if (error || !data) return <Error error={error} />;

  const { cars, devices, alerts } = data;

  const onlineDevices = devices.filter(
    (d: IoTDevice) => d.status === "ONLINE"
  ).length;

  const recentCriticalAlerts = alerts
    .filter((a: Alert) => a.severity === "CRITICAL")
    .slice(0, 5);

  const metrics = [
    {
      label: "Total Cars",
      value: cars.length,
      icon: CarIcon,
      color: "text-purple-600",
      trend: "+1",
    },
    {
      label: "Active Alerts",
      value: alerts.length,
      icon: BellRing,
      color: "text-blue-600",
      trend: "+1",
    },
    {
      label: "IoT Devices",
      value: devices.length,
      icon: Activity,
      color: "text-orange-600",
      trend: "+2",
    },
    {
      label: "Device Status",
      value: `${onlineDevices}/${devices.length}`,
      icon: Wifi,
      color: "text-green-600",
      trend: "+1",
    },
  ];

  return (
    <CloudLayout>
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-4">
          {metrics.map((metric, idx) => (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{metric.label}</CardTitle>
                <metric.icon className={`${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  {metric.trend} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Type Distribution (Last 7 Days)</CardTitle>
              <CardDescription>{getLastNDaysRangeLabel(7)}</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertTypeBarChart alerts={filterAlertsByDays(alerts, 7)} />
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="text-muted-foreground leading-none">
                Showing total alerts for the last 7 days
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Type Distribution (Last 30 Days)</CardTitle>
              <CardDescription>{getLastNDaysRangeLabel(30)}</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertTypeBarChart alerts={filterAlertsByDays(alerts, 30)} />
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="text-muted-foreground leading-none">
                Showing total alerts for the last 30 days
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Volume Over Time (Last 7 Days)</CardTitle>
              <CardDescription>{getLastNDaysRangeLabel(7)}</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertLineChart alerts={filterAlertsByDays(alerts, 7)} />
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="text-muted-foreground leading-none">
                Showing total alerts for the last 7 days
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Volume Over Time (Last 30 Days)</CardTitle>
              <CardDescription>{getLastNDaysRangeLabel(30)}</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertLineChart alerts={filterAlertsByDays(alerts, 30)} />
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="text-muted-foreground leading-none">
                Showing total alerts for the last 30 days
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Recent critical alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Critical Alerts</CardTitle>
            <CardDescription>All recent critical alerts </CardDescription>
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
                        <TableCell>{alert.message}</TableCell>
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
