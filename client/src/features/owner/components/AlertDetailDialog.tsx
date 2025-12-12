import { AlertSeverityBadge } from "@/components/status/AlertSeverityBadge";
import { AlertStatusBadge } from "@/components/status/AlertStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Alert, IoTDevice } from "@/domain/types";
import { capitalize, formatDate } from "@/utils";

interface AlertDetailDialogProps {
  alert: Alert | null;
  device: IoTDevice | null;
  open: boolean;
  onClose: () => void;
  onAcknowledge: (alertId: string) => void;
}

export function AlertDetailDialog({
  alert,
  device,
  open,
  onClose,
  onAcknowledge,
}: AlertDetailDialogProps) {
  if (!alert) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Alert Detail</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <AlertSeverityBadge severity={alert.severity} />
            <AlertStatusBadge status={alert.status} />
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="space-y-3 text-sm text-slate-700 mt-2">
          <div>
            <p className="text-xs text-slate-500">Type</p>
            <p className="font-medium">
              {alert.type
                ? capitalize(String(alert.type))
                : alert.alertType
                ? capitalize(String(alert.alertType))
                : "Unknown"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Message</p>
            <p>{alert.description}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Detected at</p>
            <p className="font-medium">{formatDate(alert.createdAt)}</p>
          </div>

          {device && (
            <div>
              <p className="text-sm text-muted-foreground">
                Triggered by device
              </p>
              <p className="font-medium">{device.deviceName}</p>
            </div>
          )}
        </div>

        <Separator />

        <DialogFooter>
          {alert.status === "NEW" && (
            <Button onClick={() => onAcknowledge(alert.id)} variant="default">
              Acknowledge
            </Button>
          )}

          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
