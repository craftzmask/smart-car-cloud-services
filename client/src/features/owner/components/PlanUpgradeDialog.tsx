import type { PlanId } from "@/domain/types";
import { useEffect, useState } from "react";
import { OWNER_PLANS } from "../config/ownerPlans";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlanUpgradeDialogProps {
  open: boolean;
  currentPlanId: PlanId;
  onClose: () => void;
  onConfirm: (planId: PlanId) => void;
}

export function PlanUpgradeDialog({
  open,
  currentPlanId,
  onClose,
  onConfirm,
}: PlanUpgradeDialogProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>(currentPlanId);

  useEffect(() => {
    if (open) {
      setSelectedPlanId(currentPlanId);
    }
  }, [open, currentPlanId]);

  function handleConfirm() {
    onConfirm(selectedPlanId);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-3xl">
        <DialogHeader>
          <DialogTitle>Change plan</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 md:grid-cols-3 mt-2">
          {OWNER_PLANS.map((plan) => {
            const isCurrent = plan.id === currentPlanId;
            const isSelected = plan.id === selectedPlanId;
            return (
              <Card
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`transition hover:cursor-pointer ${
                  isSelected
                    ? "border-green-600"
                    : "border-slate-200 hover:shadow-lg hover:border-slate-500"
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <p>{plan.name}</p>
                    {isCurrent && (
                      <p className="text-sm text-green-600">Current Plan</p>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-semibold">
                    {`$${plan.pricePerMonth.toFixed(2)}/month`}
                  </p>

                  <p>{plan.description}</p>

                  {plan.features.slice(0, 3).map((f) => (
                    <p key={f} className="text-sm text-muted-foreground">
                      • {f}
                    </p>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm change</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
