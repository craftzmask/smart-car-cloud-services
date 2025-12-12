import type { AiModel } from "@/domain/types";
import { authFetch } from "@/lib/authFetch";
import { getApiBaseUrl } from "@/lib/apiConfig";

function mapModel(dto: any): AiModel {
  return {
    id: dto?.id || dto?._id || dto?.name,
    name: dto?.name || "",
    type: dto?.type || "",
    version: dto?.version || "v1.0.0",
    status: dto?.status || "RUNNING",
    updatedAt: dto?.updatedAt || new Date().toISOString(),
    accuracy: typeof dto?.accuracy === "number" ? dto.accuracy : 0,
    deploymentStage: dto?.deploymentStage || "STAGING",
    results: dto?.results ?? [],
  };
}

export async function createAiModel(payload: {
  name: string;
  type: string;
  version?: string;
  status?: AiModel["status"];
}): Promise<AiModel> {
  const res = await authFetch("/ai-models", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || "Failed to create AI model");
  }
  return mapModel(body.data);
}

export async function predictWithAiModel(
  modelId: string,
  file: File
): Promise<any> {
  const raw =
    typeof window !== "undefined" ? localStorage.getItem("authUser") : null;
  const token = raw ? (JSON.parse(raw) as any)?.tokens?.accessToken : null;

  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${getApiBaseUrl()}/ai-models/${modelId}/predict`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || "Failed to run prediction");
  }
  return body.data;
}

export async function judgeAiResult(payload: {
  modelId: string;
  filename?: string;
  createdAt?: string;
  isCorrect: boolean;
}) {
  const res = await authFetch(`/ai-models/${payload.modelId}/results/judge`, {
    method: "PATCH",
    body: JSON.stringify({
      filename: payload.filename,
      createdAt: payload.createdAt,
      isCorrect: payload.isCorrect,
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || "Failed to update result judgement");
  }
  return body.data;
}
