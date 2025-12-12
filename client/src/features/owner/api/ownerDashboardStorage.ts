import type { OwnerDashboardData } from "@/domain/types";
import { getApiBaseUrl } from "@/lib/apiConfig";

export async function saveOwnerDashboard(data: OwnerDashboardData) {
  if (typeof window === "undefined") return;

  const raw = localStorage.getItem("authUser");
  if (!raw) return;
  const token = JSON.parse(raw)?.tokens?.accessToken;
  if (!token) return;

  const baseUrl = getApiBaseUrl();
  console.log("Persisting owner dashboard", data);
  try {
    await fetch(`${baseUrl}/owner/dashboard`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn("Failed to persist owner dashboard", err);
  }
}
