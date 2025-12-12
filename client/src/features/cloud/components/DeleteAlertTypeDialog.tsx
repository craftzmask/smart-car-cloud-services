import { AlertSeverityBadge } from "@/components/status/AlertSeverityBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { AlertTypeDef } from "@/domain/types";

interface DeleteAlertTypeDialogProps {
  open: boolean;
  alertType: AlertTypeDef | null;
  onClose: () => void;
  onConfirm: (type: string) => void;
}

export function DeleteAlertTypeDialog({
  open,
  alertType,
  onClose,
  onConfirm,
}: DeleteAlertTypeDialogProps) {
  function handleConfirm() {
    if (!alertType) return;
    const typeKey = alertType.type || alertType.key;
    if (!typeKey) return;
    onConfirm(typeKey);
    onClose();
  }

  if (!alertType) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Alert Type</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this alert type from the platform?
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle>{alertType.name || alertType.type || alertType.key}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span>{alertType.type || alertType.key}</span>
              <span>{alertType.category ?? "Unknown"}</span>
              <AlertSeverityBadge severity={alertType.defaultSeverity || "INFO"} />
            </CardDescription>
          </CardHeader>
        </Card>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm}>
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
