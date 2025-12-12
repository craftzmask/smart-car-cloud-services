import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { AlertCategory, AlertTypeDef } from "@/domain/types";
import { capitalize } from "@/utils";
import { useEffect, useState, type FormEvent } from "react";

interface EditAlertTypeDialogProps {
  open: boolean;
  alertType: AlertTypeDef | null;
  onClose: () => void;
  onSave: (updated: AlertTypeDef) => void;
}

const CATEGORY_OPTIONS: AlertCategory[] = [
  "SAFETY",
  "SECURITY",
  "MAINTENANCE",
  "ANIMAL",
  "PASSENGER",
  "UNKNOWN",
];

export function EditAlertTypeDialog({
  open,
  alertType,
  onClose,
  onSave,
}: EditAlertTypeDialogProps) {
  const [keyValue, setKeyValue] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<AlertCategory>("SAFETY");
  const [defaultSeverity, setDefaultSeverity] =
    useState<AlertTypeDef["defaultSeverity"]>("INFO");
  const [description, setDescription] = useState("");
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (open && alertType) {
      setKeyValue(alertType.type || alertType.key || "");
      setName(alertType.name || "");
      setCategory((alertType.category as AlertCategory) || "UNKNOWN");
      setDefaultSeverity(alertType.defaultSeverity || "INFO");
      setDescription(alertType.description || "");
      setEnabled(alertType.enabled ?? true);
    }
  }, [open, alertType]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!alertType) return;
    if (!keyValue.trim() || !name.trim()) return;

    onSave({
      ...alertType,
      type: keyValue.trim(),
      key: keyValue.trim(),
      name: name.trim(),
      category,
      defaultSeverity,
      description: description.trim(),
      enabled,
    });

    onClose();
  }

  if (!alertType) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Alert Type</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>Key (internal)</FieldLabel>
              <Input
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
                placeholder="engine_knock"
              />
              <FieldDescription>
                Used by backend / models. Use snake_case, unique per type.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Engine knock detected"
              />
            </Field>

            <Field>
              <FieldLabel>Category</FieldLabel>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as AlertCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select Category</SelectLabel>
                    {CATEGORY_OPTIONS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {capitalize(c)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Default Severity</FieldLabel>
              <Select
                value={defaultSeverity}
                onValueChange={(value) =>
                  setDefaultSeverity(value as AlertTypeDef["defaultSeverity"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select Severity</SelectLabel>
                    <SelectItem value="INFO">Info</SelectItem>
                    <SelectItem value="WARN">Warn</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Description (optional)</FieldLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-30"
              />
            </Field>

            <Field>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="enabled"
                  checked={enabled}
                  onCheckedChange={(checkedState) => {
                    if (typeof checkedState === "boolean") {
                      setEnabled(checkedState);
                    }
                  }}
                />
                <FieldLabel htmlFor="enabled">Enabled by default</FieldLabel>
              </div>
            </Field>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Edit Alert</Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
