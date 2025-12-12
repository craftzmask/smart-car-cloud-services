import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import type { AiModel, AiModeStatus } from "@/domain/types";
import {
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, type FormEvent } from "react";

interface EditModelDialogProps {
  open: boolean;
  model: AiModel | null;
  onClose: () => void;
  onSave: (updated: AiModel) => void;
}

export function EditModelDialog({
  open,
  model,
  onClose,
  onSave,
}: EditModelDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [version, setVersion] = useState("");
  const [status, setStatus] = useState<AiModeStatus>("RUNNING");

  useEffect(() => {
    if (open && model) {
      setName(model.name);
      setType(model.type);
      setVersion(model.version);
      setStatus(model.status);
    }
  }, [open, model]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!model) return;
    if (!name.trim() || !type.trim()) return;

    onSave({
      ...model,
      name: name.trim(),
      type: type.trim(),
      version: version.trim() || model.version,
      status,
      updatedAt: new Date().toISOString(),
    });

    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit AI Model</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>Model name</FieldLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Engine Noise Classifier"
              />
            </Field>

            <Field>
              <FieldLabel>Model type</FieldLabel>
              <Input
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Engine audio anomaly detection"
              />
            </Field>

            <Field>
              <FieldLabel>Version</FieldLabel>
              <Input
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="v1.0.0"
              />
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as AiModeStatus)}
              >
                <SelectTrigger className="bg-slate-50">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select Status</SelectLabel>
                    <SelectItem value="RUNNING">Running</SelectItem>
                    <SelectItem value="TRAINING">Training</SelectItem>
                    <SelectItem value="OFFLINE">Offline</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
