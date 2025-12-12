import { EmptyState } from "@/components/shared/EmptyState";
import { AlertSeverityBadge } from "@/components/status/AlertSeverityBadge";
import { AlertStatusBadge } from "@/components/status/AlertStatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
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
import type { Alert, AlertTypeDef, AlertSeverity } from "@/domain/types";
import { capitalize, formatDate } from "@/utils";

interface AlertsSectionProps {
  alerts: Alert[];
  alertTypes?: AlertTypeDef[];
  onSelectAlert: (alert: Alert) => void;
}

export function AlertsSection({
  alerts,
  alertTypes = [],
  onSelectAlert,
}: AlertsSectionProps) {
  const severityByType = new Map<string, string>();
  alertTypes.forEach((t) => {
    if (t.type && t.defaultSeverity) {
      severityByType.set(t.type, t.defaultSeverity);
    }
  });

  const sortedAlerts = alerts
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts</CardTitle>
        <CardDescription>
          Showing {alerts.length} alert{alerts.length === 1 ? "" : "s"} for this
          car
        </CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <EmptyState message="No alerts for this car in the recent period" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((alert) => (
                  <TableRow
                    key={alert.id}
                    onClick={() => onSelectAlert(alert)}
                    className="hover:cursor-pointer"
                  >
                    <TableCell className="text-slate-500">
                      {formatDate(alert.createdAt)}
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">
                      {alert.type
                        ? capitalize(String(alert.type))
                        : alert.alertType
                        ? capitalize(String(alert.alertType))
                        : "Unknown"}
                    </TableCell>
                    <TableCell>
                      <AlertSeverityBadge
                        severity={
                          (severityByType.get(
                            alert.type || (alert as any).alertType
                          ) as AlertSeverity) || alert.severity
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <AlertStatusBadge status={alert.status} />
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {alert.description}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
