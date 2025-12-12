import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import type { Alert, Car } from "@/domain/types";
import { useCloudDashboard } from "@/features/cloud/hooks/useCloudDashboard";
import { useState } from "react";
import { CloudLayout } from "../components/CloudLayout";
import { type AlertSeverityFilter } from "@/features/owner/components/AlertsFilterBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export function CloudAlertsPage() {
  const { data, isLoading, error } = useCloudDashboard();
  const [severityFilter, setSeverityFilter] =
    useState<AlertSeverityFilter>("ALL");
  const [search, setSearch] = useState("");

  if (isLoading) return <Loading />;
  if (error || !data) return <Error error={error} />;

  const { cars, alerts, alertTypes } = data;

  const severityByType = new Map<string, string>();
  alertTypes.forEach((t) => {
    if (t.type && t.defaultSeverity) {
      severityByType.set(t.type, t.defaultSeverity);
    }
  });

  function getAlerts() {
    let result = alerts as Alert[];

    if (severityFilter !== "ALL") {
      result = result.filter((alert) => alert.severity === severityFilter);
    }

    const term = search.trim().toLowerCase();
    if (term.length > 0) {
      result = result.filter((alert) => {
        const car = cars.find((c: Car) => c.id === alert.carId);
        const carText = car
          ? `${car.make} ${car.model} ${car.vin}`.toLowerCase()
          : "";

        return (
          (alert.message || "").toLowerCase().includes(term) ||
          (alert.description || "").toLowerCase().includes(term) ||
          (alert.type || (alert as any).alertType || "")
            .toString()
            .toLowerCase()
            .includes(term) ||
          carText.includes(term)
        );
      });
    }

    return result;
  }

  const filteredAlerts = getAlerts();

  return (
    <CloudLayout>
      <div className="p-6">
        {/* Header + stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          {/**
          <div className="flex gap-4 text-xs text-slate-600">
            <div className="flex flex-col items-end">
              <span className="uppercase tracking-wide text-[10px] text-slate-400">
                TOTAL
              </span>
              <span className="text-sm font-medium">{alerts.length}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="uppercase tracking-wide text-[10px] text-slate-400">
                CRITICAL
              </span>
              <span className="text-sm font-medium text-rose-600">
                {totalCritical}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="uppercase tracking-wide text-[10px] text-slate-400">
                WARN
              </span>
              <span className="text-sm font-medium text-amber-600">
                {totalWarn}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="uppercase tracking-wide text-[10px] text-slate-400">
                INFO
              </span>
              <span className="text-sm font-medium text-slate-600">
                {totalInfo}
              </span>
            </div>
          </div>
          */}
        </div>

        {/* Filters */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="font-semibold text-slate-900">
              Alert feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div className="inline-flex rounded-md border border-slate-200 bg-white overflow-hidden">
                {(
                  ["ALL", "INFO", "WARN", "CRITICAL"] as AlertSeverityFilter[]
                ).map((option) => {
                  const isActive = severityFilter === option;
                  return (
                    <Button
                      key={option}
                      variant={isActive ? "default" : "ghost"}
                      className={
                        isActive
                          ? "px-6"
                          : "px-6 text-slate-700 hover:bg-slate-50"
                      }
                      onClick={() => setSeverityFilter(option)}
                    >
                      {capitalize(option)}
                    </Button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Search</span>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by car, type, or message…"
                  className="h-9 w-60"
                />
              </div>
            </div>

            {/* Table */}
            {filteredAlerts.length === 0 ? (
              <div className="text-slate-500">
                No alerts match the current filters.
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
                  {filteredAlerts.map((alert) => {
                    const car = cars.find((c: Car) => c.id === alert.carId);
                    return (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">
                              {car ? `${car.make} ${car.model}` : "Unknown car"}
                            </span>
                            {car && (
                              <span className="text-sm text-slate-500">
                                VIN: {car.vin}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-700">
                          {capitalize(
                            (alert.type ||
                              (alert as any).alertType ||
                              "Unknown") as string
                          )}
                        </TableCell>
                        <TableCell className="text-slate-700">
                          {alert.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertSeverityBadge
                            severity={
                              (severityByType.get(
                                alert.type || (alert as any).alertType
                              ) as any) || alert.severity
                            }
                          />
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
