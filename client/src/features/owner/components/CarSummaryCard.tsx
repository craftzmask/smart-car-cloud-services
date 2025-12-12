import { CarStatusBadge } from "@/components/status/CarStatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Car } from "@/domain/types";
import { Activity, Bell, BellRing, TrendingUp } from "lucide-react";

interface CarSummaryCardProps {
  car: Car;
  totalDevices: number;
  totalAlerts: number;
  criticalAlerts: number;
}

export function CarSummaryCard({
  car,
  totalDevices,
  totalAlerts,
  criticalAlerts,
}: CarSummaryCardProps) {
  const metrics = [
    {
      label: "Total Alerts",
      value: totalAlerts,
      icon: Bell,
      color: "text-blue-600",
      trend: "+1",
    },
    {
      label: "IoT Devices",
      value: totalDevices,
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-between">
            <div className="text-xl">
              {car.make} {car.model}
            </div>
            <CarStatusBadge status={car.status} />
          </CardTitle>
          <CardDescription className="flex flex-col gap-2">
            <p>VIN: {car.vin}</p>
            <p>Year: {car.year}</p>
          </CardDescription>
        </CardHeader>
      </Card>

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
  );
}
