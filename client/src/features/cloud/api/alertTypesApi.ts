import type { AlertCategory, AlertTypeDef } from "@/domain/types";
import { authFetch } from "@/lib/authFetch";

type AlertTypeDto = Partial<AlertTypeDef> & {
  defaultseverity?: string;
  category?: AlertCategory | string;
  enabled?: boolean;
};

function mapAlertType(dto: AlertTypeDto): AlertTypeDef {
  const type = dto.type || dto.key;
  const defaultSeverity: AlertTypeDef["defaultSeverity"] | undefined =
    dto.defaultSeverity ||
    (dto.defaultseverity
      ? (String(
          dto.defaultseverity
        ).toUpperCase() as AlertTypeDef["defaultSeverity"])
      : undefined);

  const categoryRaw = dto.category
    ? String(dto.category).toUpperCase()
    : undefined;
  const category = categoryRaw as AlertCategory | "UNKNOWN" | undefined;

  return {
    id: type,
    key: type,
    type,
    name: dto.name,
    description: dto.description,
    category,
    defaultSeverity,
    enabled: dto.enabled,
  };
}

export async function createAlertType(input: {
  type: string;
  description?: string;
  defaultSeverity?: AlertTypeDef["defaultSeverity"];
  category?: AlertTypeDef["category"];
  enabled?: boolean;
  name?: string;
}): Promise<AlertTypeDef> {
  const res = await authFetch("/alert-types", {
    method: "POST",
    body: JSON.stringify({
      type: input.type,
      name: input.name,
      description: input.description ?? input.name,
      defaultSeverity: input.defaultSeverity,
      category: input.category,
      enabled: input.enabled,
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || "Failed to create alert type");
  }

  return mapAlertType(body.data);
}

export async function updateAlertType(
  type: string,
  input: {
    newType?: string;
    description?: string;
    defaultSeverity?: AlertTypeDef["defaultSeverity"];
    category?: AlertTypeDef["category"];
    enabled?: boolean;
    name?: string;
  }
): Promise<AlertTypeDef> {
  const res = await authFetch(`/alert-types/${type}`, {
    method: "PUT",
    body: JSON.stringify({
      newType: input.newType,
      name: input.name,
      description: input.description ?? input.name,
      defaultSeverity: input.defaultSeverity,
      category: input.category,
      enabled: input.enabled,
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || "Failed to update alert type");
  }

  return mapAlertType(body.data);
}

export async function deleteAlertType(type: string): Promise<string> {
  const res = await authFetch(`/alert-types/${type}`, { method: "DELETE" });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || "Failed to delete alert type");
  }
  return type;
}
