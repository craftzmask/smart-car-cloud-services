import { getApiBaseUrl } from "./apiConfig";

export async function authFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const baseUrl = getApiBaseUrl();

  let token: string | null = null;
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("authUser");
    token = raw ? (JSON.parse(raw) as any)?.tokens?.accessToken : null;
  }

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("authUser");
    window.location.href = "/login";
  }

  return res;
}
