import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IoTDevice, DeviceType } from "@/domain/types";
import { useEffect, useState, type FormEvent } from "react";

interface AddDeviceDialogProps {
  open: boolean;
  carId: string;
  onClose: () => void;
  onSave: (device: Omit<IoTDevice, "id">) => void;
}

export function AddDeviceDialog({
  open,
  carId,
  onClose,
  onSave,
}: AddDeviceDialogProps) {
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState<DeviceType>("AUDIO");
  const [status, setStatus] = useState<"ONLINE" | "OFFLINE">("ONLINE");

  useEffect(() => {
    setDeviceName("");
    setDeviceType("AUDIO");
    setStatus("ONLINE");
  }, [open]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!deviceName.trim()) return;

    onSave({
      carId,
      deviceName: deviceName.trim(),
      deviceType,
      status,
      createdAt: new Date().toISOString(),
    });

    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Device</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>Device name</FieldLabel>
              <Input
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="Front cabin mic"
              />
            </Field>

            <Field>
            <FieldLabel>Device type</FieldLabel>
            <Select
              value={deviceType}
              onValueChange={(value) => setDeviceType(value as DeviceType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Device Type" />
              </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Device Type</SelectLabel>
                    <SelectItem value="AUDIO">Audio Sensor</SelectItem>
                    <SelectItem value="CAMERA">Camera</SelectItem>
                    <SelectItem value="MICROPHONE">Microphone</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value === "ONLINE" ? "ONLINE" : "OFFLINE")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Device Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Device Status</SelectLabel>
                    <SelectItem value="ONLINE">Online</SelectItem>
                    <SelectItem value="OFFLINE">Offline</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>

              <Button type="submit">Save Device</Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
