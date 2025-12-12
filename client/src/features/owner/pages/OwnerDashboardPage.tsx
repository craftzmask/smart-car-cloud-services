import { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import Loading from "@/components/shared/Loading";
import Error from "@/components/shared/Error";
import { OwnerLayout } from "@/features/owner/components/OwnerLayout";
import { CarSummaryCard } from "@/features/owner/components/CarSummaryCard";
import { AlertsSection } from "../components/AlertsSection";
import { DevicesSection } from "../components/DevicesSection";
import { AlertDetailDialog } from "../components/AlertDetailDialog";
import { OwnerServiceConfigSection } from "../components/OwnerServiceConfigSection";
import { AlertsFilterBar } from "../components/AlertsFilterBar";
import type { AlertSeverityFilter } from "../components/AlertsFilterBar";
import { Separator } from "@/components/ui/separator";
import type {
  Alert,
  CarServiceConfig,
  IntelligenceServiceKey,
} from "@/domain/types";
import { useOwnerDashboard } from "../hooks/useOwnerDashboard";

export function OwnerDashboardPage() {
  const { user } = useAuth();
  const ownerId = user?.id || "me";
  const { data, isLoading, error } = useOwnerDashboard(ownerId);

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [serviceConfigs, setServiceConfigs] = useState<CarServiceConfig[]>([]);
  const [alertsState, setAlertsState] = useState<Alert[]>([]);
  const [severityFilter, setSeverityFilter] =
    useState<AlertSeverityFilter>("ALL");
  const [alertSearch, setAlertSearch] = useState<string>("");

  useEffect(() => {
    if (data?.carServiceConfigs) {
      setServiceConfigs(data.carServiceConfigs);
    }
    if (data?.alerts) {
      setAlertsState(data.alerts);
    }
  }, [data]);

  function handleSelectAlert(alert: Alert) {
    setSelectedAlert(alert);
    setDialogOpen(true);
  }

  function handleAcknowledge(alertId: string) {
    setAlertsState((prevAlerts) =>
      prevAlerts.map((a) =>
        a.id === alertId ? { ...a, status: "ACKNOWLEDGED" as const } : a
      )
    );

    setSelectedAlert((prev) =>
      prev ? { ...prev, status: "ACKNOWLEDGED" as const } : prev
    );
  }

  function handleToggleService(
    carId: string,
    key: IntelligenceServiceKey,
    enabled: boolean
  ) {
    setServiceConfigs((prev) =>
      prev.map((cfg) =>
        cfg.carId !== carId
          ? cfg
          : {
              ...cfg,
              services: cfg.services.map((s) =>
                s.key === key ? { ...s, enabled } : s
              ),
            }
      )
    );
  }

  if (isLoading) return <Loading />;
  if (error || !data) return <Error error={error} />;

  const { cars, devices, alertTypes = [] } = data;

  return (
    <OwnerLayout
      cars={cars}
      ownerName={data.owner?.username || data.owner?.cognitoUsername}
    >
      {(selectedCarId) => {
        const selectedCar =
          cars.find((c) => c.id === (selectedCarId || "")) || null;
        if (!selectedCar) {
          return (
            <div className="text-sm text-slate-500">
              No car selected or no cars available.
            </div>
          );
        }

        const carAlerts = alertsState.filter(
          (alert) => alert.carId === selectedCarId
        );
        const carDevices = devices.filter(
          (device) => device.carId === selectedCarId
        );

        const totalAlerts = carAlerts.length;
        const criticalAlerts = carAlerts.filter(
          (a: Alert) => a.severity === "CRITICAL"
        ).length;

        const filteredAlerts = carAlerts.filter((alert) => {
          const severityOk =
            severityFilter === "ALL" || alert.severity === severityFilter;

          const query = alertSearch.trim().toLowerCase();
          if (!query) return severityOk;

          const alertTypeText = (alert.type || alert.alertType || "")
            .toString()
            .toLowerCase();
          const haystack = `${alertTypeText} ${
            alert.description || ""
          }`.toLowerCase();
          return severityOk && haystack.includes(query);
        });

        return (
          <div className="space-y-6">
            <CarSummaryCard
              car={selectedCar}
              totalDevices={carDevices.length}
              totalAlerts={totalAlerts}
              criticalAlerts={criticalAlerts}
            />

            <Separator />

            <AlertsFilterBar
              severity={severityFilter}
              onChangeSeverity={setSeverityFilter}
              searchQuery={alertSearch}
              onChangeSearch={setAlertSearch}
              totalCount={carAlerts.length}
              filteredCount={filteredAlerts.length}
            />

            <AlertsSection
              alerts={filteredAlerts}
              alertTypes={alertTypes}
              onSelectAlert={handleSelectAlert}
            />

            <DevicesSection devices={carDevices} />

            <AlertDetailDialog
              alert={selectedAlert}
              device={
                selectedAlert
                  ? carDevices.find(
                      (device) => device.id === selectedAlert.deviceId
                    ) || null
                  : null
              }
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              onAcknowledge={handleAcknowledge}
            />

            <OwnerServiceConfigSection
              carId={selectedCar.id}
              configs={serviceConfigs}
              onToggleService={handleToggleService}
            />
          </div>
        );
      }}
    </OwnerLayout>
  );
}
