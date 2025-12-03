import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import type { Alert, Car } from "@/domain/types";
import { useOwnerDashboard } from "@/features/owner/hooks/useOwnerDashboard";
import { useState } from "react";
import { CloudLayout } from "../components/CloudLayout";
import {
  AlertsFilterBar,
  type AlertSeverityFilter,
} from "@/features/owner/components/AlertsFilterBar";
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
import { AlertsSection } from "@/features/owner/components/AlertsSection";
import {
  BellRing,
  Info,
  OctagonAlert,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function CloudAlertsPage() {
  const ownerId = "u-owner-1";
  const { data, isLoading, error } = useOwnerDashboard(ownerId);
  const [severityFilter, setSeverityFilter] =
    useState<AlertSeverityFilter>("ALL");
  const [search, setSearch] = useState("");

  if (isLoading) return <Loading />;
  if (error || !data) return <Error error={error} />;

  const { cars, alerts } = data;

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
          alert.message.toLowerCase().includes(term) ||
          alert.type.toLowerCase().includes(term) ||
          carText.includes(term)
        );
      });
    }

    return result;
  }

  const filteredAlerts = getAlerts();

  const totalCritical = alerts.filter(
    (a: Alert) => a.severity === "CRITICAL"
  ).length;
  const totalWarn = alerts.filter((a: Alert) => a.severity === "WARN").length;
  const totalInfo = alerts.filter((a: Alert) => a.severity === "INFO").length;

  const metrics = [
    {
      label: "Total Alerts",
      value: alerts.length,
      icon: BellRing,
      color: "text-purple-600",
      trend: "+1",
    },
    {
      label: "Total Info",
      value: totalInfo,
      icon: Info,
      color: "text-blue-600",
      trend: "+1",
    },
    {
      label: "Total Warn",
      value: totalWarn,
      icon: TriangleAlert,
      color: "text-amber-600",
      trend: "+2",
    },
    {
      label: "Total Critical",
      value: totalCritical,
      icon: OctagonAlert,
      color: "text-rose-600",
      trend: "+1",
    },
  ];

  return (
    <CloudLayout>
      <div className="p-6 space-y-6">
        {/* Header + stats */}
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

        {/* Filters */}
        <AlertsFilterBar
          severity={severityFilter}
          onChangeSeverity={setSeverityFilter}
          searchQuery={search}
          onChangeSearch={setSearch}
          totalCount={0}
          filteredCount={filteredAlerts.length}
        />

        <AlertsSection
          alerts={filteredAlerts}
          onSelectAlert={() => console.log(1)}
        />
      </div>
    </CloudLayout>
  );
}

// <Card className="shadow-sm border-slate-200">
//   <CardHeader className="pb-3">
//     <CardTitle className="font-semibold text-slate-900">
//       Alert feed
//     </CardTitle>
//   </CardHeader>
//   <CardContent>
//     <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
//       <div className="inline-flex rounded-md border border-slate-200 bg-white overflow-hidden">
//         {(
//           ["ALL", "INFO", "WARN", "CRITICAL"] as AlertSeverityFilter[]
//         ).map((option) => {
//           const isActive = severityFilter === option;
//           return (
//             <Button
//               key={option}
//               variant={isActive ? "default" : "ghost"}
//               className={
//                 isActive
//                   ? "px-6"
//                   : "px-6 text-slate-700 hover:bg-slate-50"
//               }
//               onClick={() => setSeverityFilter(option)}
//             >
//               {capitalize(option)}
//             </Button>
//           );
//         })}
//       </div>

//       <div className="flex items-center gap-2">
//         <span className="text-sm text-slate-500">Search</span>
//         <Input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Filter by car, type, or message…"
//           className="h-9 w-60"
//         />
//       </div>
//     </div>

//     {/* Table */}
//     {filteredAlerts.length === 0 ? (
//       <div className="text-slate-500">
//         No alerts match the current filters.
//       </div>
//     ) : (
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Car</TableHead>
//             <TableHead>Type</TableHead>
//             <TableHead>Message</TableHead>
//             <TableHead className="text-right">Severity</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {filteredAlerts.map((alert) => {
//             const car = cars.find((c: Car) => c.id === alert.carId);
//             return (
//               <TableRow key={alert.id}>
//                 <TableCell>
//                   <div className="flex flex-col">
//                     <span className="font-medium text-slate-900">
//                       {car ? `${car.make} ${car.model}` : "Unknown car"}
//                     </span>
//                     {car && (
//                       <span className="text-sm text-slate-500">
//                         VIN: {car.vin}
//                       </span>
//                     )}
//                   </div>
//                 </TableCell>
//                 <TableCell className="text-slate-700">
//                   {capitalize(alert.type)}
//                 </TableCell>
//                 <TableCell className="text-slate-700">
//                   {alert.message}
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <AlertSeverityBadge severity={alert.severity} />
//                 </TableCell>
//               </TableRow>
//             );
//           })}
//         </TableBody>
//       </Table>
//     )}
//   </CardContent>
// </Card>
