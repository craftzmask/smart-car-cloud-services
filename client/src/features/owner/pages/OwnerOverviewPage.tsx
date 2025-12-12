import type { Car } from "@/domain/types";
import { useOwnerDashboard } from "../hooks/useOwnerDashboard";
import { OwnerLayout } from "../components/OwnerLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import Loading from "@/components/shared/Loading";
import Error from "@/components/shared/Error";
import {
  capitalize,
  filterAlertsByDays,
  getLastNDaysRangeLabel,
} from "@/utils";
import {
  Activity,
  Bell,
  BellRing,
  Car as CarIcon,
  TrendingUp,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/EmptyState";
import { CarStatusBadge } from "@/components/status/CarStatusBadge";
import { AlertLineChart, AlertTypeBarChart } from "@/components/shared/Chart";
import { Alert } from "@/components/ui/alert";
import { AlertPieChart } from "@/components/shared/Chart";
import SimpleMap from "@/components/shared/Map";
import { formatDate } from "@/utils";
import { useAuth } from "@/auth/AuthContext";

export function OwnerOverviewPage() {
  const { user } = useAuth();
  const ownerId = user?.id || "me";
  const { data, isLoading, error } = useOwnerDashboard(ownerId);

  if (isLoading) return <Loading />;

  if (error || !data) return <Error error={error} />;

  const { cars, alerts, devices, carLocations } = data;

  const criticalAlerts = alerts.filter(
    (alert) => alert.severity === "CRITICAL"
  ).length;
  const activeAlerts = alerts.filter(
    (alert) => alert.status !== "RESOLVED"
  ).length;

  // helper to get per-car data
  function getCarMetrics(car: Car) {
    const carAlerts = alerts.filter((alert) => alert.carId === car.id);
    const carDevices = devices.filter((device) => device.carId === car.id);
    const location = carLocations.find((loc) => loc.carId === car.id);

    const lastAlert =
      carAlerts.length === 0
        ? null
        : carAlerts
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )[0];

    return { carAlerts, carDevices, location, lastAlert };
  }

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
      value: activeAlerts,
      icon: Bell,
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
      label: "Critical Alerts",
      value: criticalAlerts,
      icon: BellRing,
      color: "text-rose-600",
      trend: "+1",
    },
  ];

  return (
    <OwnerLayout
      cars={cars}
      ownerName={data.owner?.username || data.owner?.cognitoUsername}
    >
      {() => (
        <div className="space-y-6">
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

          <Card>
            <CardHeader>
              <CardTitle>My Cars</CardTitle>
              <CardDescription>Cars overview & locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {cars.map((car) => {
                  const { location, lastAlert } = getCarMetrics(car);
                  return (
                    <div
                      key={car.id}
                      className="border border-slate-20 rounded-lg p-3 flex flex-col gap-3"
                    >
                      {/* map view */}
                      <div className="h-48 overflow-hidden rounded-lg border border-slate-200">
                        {location ? (
                          <>
                            <SimpleMap carLocation={location} />
                            <div className="mt-2 text-xs text-slate-600 text-center">
                              Last seen: {formatDate(location.lastSeenAt)}
                            </div>
                          </>
                        ) : (
                          <EmptyState message="No location data" />
                        )}
                      </div>

                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-bold">
                              {car.make} {car.model}
                            </p>
                            <CarStatusBadge status={car.status} />
                          </div>
                          <p className="text-muted-foreground">
                            VIN: {car.vin}
                          </p>
                          {!lastAlert ? (
                            <EmptyState message="Currently, no alerts in this vehicle" />
                          ) : (
                            <p className="text-muted-foreground">
                              Last alert:{" "}
                              <span className="font-medium">
                                {lastAlert.type
                                  ? capitalize(String(lastAlert.type))
                                  : (lastAlert as any).alertType
                                  ? capitalize(
                                      String((lastAlert as any).alertType)
                                    )
                                  : lastAlert.description
                                  ? capitalize(String(lastAlert.description))
                                  : "Unknown"}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </OwnerLayout>
  );
}
