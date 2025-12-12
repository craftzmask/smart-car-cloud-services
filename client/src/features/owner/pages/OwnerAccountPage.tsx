import Loading from "@/components/shared/Loading";
import { useOwnerDashboard } from "../hooks/useOwnerDashboard";
import Error from "@/components/shared/Error";
import { OwnerLayout } from "../components/OwnerLayout";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { OwnerPlanCard } from "../components/OwnerPlanCard";
import { OwnerNotificationPreferencesSection } from "../components/OwnerNotificationPreferencesSection";
import type {
  NotificationChannelKey,
  OwnerDashboardData,
  PlanId,
} from "@/domain/types";
import { useState } from "react";
import { PlanUpgradeDialog } from "../components/PlanUpgradeDialog";
import { useQueryClient } from "@tanstack/react-query";
import { OWNER_PLANS } from "../config/ownerPlans";
import { saveOwnerDashboard } from "../api/ownerDashboardStorage";
import {
  updateChannel,
  updateSubcriptionPlan,
} from "../api/ownerDashboardMutations";
import { useAuth } from "@/auth/AuthContext";

export function OwnerAccountPage() {
  const { user } = useAuth();
  const ownerId = user?.id || "me";
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useOwnerDashboard(ownerId);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);

  function handleToggleChannel(
    channel: NotificationChannelKey,
    enabled: boolean
  ) {
    queryClient.setQueryData<OwnerDashboardData | undefined>(
      ["ownerDashboard", ownerId],
      (oldData) => {
        if (!oldData) return oldData;
        const newData = updateChannel(oldData, channel, enabled);
        saveOwnerDashboard(newData); // Simulate update backend here
        return newData;
      }
    );
  }

  function handleConfirmPlan(planId: PlanId) {
    const plan = OWNER_PLANS.find((p) => p.id === planId);
    if (!plan) return;

    queryClient.setQueryData<OwnerDashboardData | undefined>(
      ["ownerDashboard", ownerId],
      (oldData) => {
        if (!oldData) return oldData;

        const newData = updateSubcriptionPlan(oldData, {
          planId: plan.id,
          planName: plan.name,
          pricePerMonth: plan.pricePerMonth,
        });

        saveOwnerDashboard(newData); // Simulate update backend here
        return newData;
      }
    );
  }

  if (isLoading) return <Loading />;

  if (error || !data) return <Error error={error} />;

  const { owner, cars, subscription, devices, alerts } = data;
  const displayName = user?.name;
  const displayEmail = user?.email;

  const totalCars = cars.length;
  const totalDevices = devices.length;
  const totalAlerts = alerts.length;
  const criticalAlerts = alerts.filter((a) => a.severity === "CRITICAL").length;

  return (
    <OwnerLayout
      cars={cars}
      ownerName={owner?.username || owner?.cognitoUsername}
    >
      {() => (
        <div className="space-y-4">
          {/* Account info */}
          <Card className="w-[50%]">
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-700">
              <div>
                <p className="text-slate-500">Name</p>
                <p className="font-medium">{displayName}</p>
              </div>
              <div>
                <p className="text-slate-500">Email</p>
                <p className="font-medium">{displayEmail || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="font-medium">{subscription.planName}</p>
              </div>
            </CardContent>
          </Card>

          <div className="w-[50%]">
            <OwnerPlanCard
              subscription={subscription}
              onUpgrade={() => setIsPlanDialogOpen(true)}
            />
          </div>

          <div className="w-[50%]">
            <OwnerNotificationPreferencesSection
              planId={subscription.planId}
              preferences={subscription.notificationPreferences}
              onToggleChannel={handleToggleChannel}
            />
          </div>

          <PlanUpgradeDialog
            open={isPlanDialogOpen}
            currentPlanId={subscription.planId}
            onClose={() => setIsPlanDialogOpen(false)}
            onConfirm={handleConfirmPlan}
          />
        </div>
      )}
    </OwnerLayout>
  );
}
