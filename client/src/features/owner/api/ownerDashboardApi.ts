import type { OwnerDashboardData, OwnerSubscription } from "@/domain/types";
import { OWNER_PLANS } from "../config/ownerPlans";
import { authFetch } from "@/lib/authFetch";

function ownerFromAuth(): OwnerDashboardData["owner"] {
  if (typeof window === "undefined") {
    return {
      id: "owner",
      name: "Owner",
      email: "",
      role: "CAR_OWNER",
      createdAt: "",
    };
  }

  try {
    const raw = localStorage.getItem("authUser");
    const parsed = raw ? JSON.parse(raw) : null;
    const user = parsed?.user;

    return {
      id: user?.id || "owner",
      name: user?.username || "Owner",
      email: user?.email || "",
      role: "CAR_OWNER",
      createdAt: user?.created_at || "",
    };
  } catch {
    return {
      id: "owner",
      name: "Owner",
      email: "",
      role: "CAR_OWNER",
      createdAt: "",
    };
  }
}

function normalizeOwnerDashboard(
  data: Partial<OwnerDashboardData> = {}
): OwnerDashboardData {
  const subscription = normalizeSubscription(
    data.subscription as Partial<OwnerSubscription> | undefined
  );

  const empty: OwnerDashboardData = {
    owner: ownerFromAuth(),
    cars: [],
    alerts: [],
    devices: [],
    carServiceConfigs: [],
    subscription,
    carLocations: [],
    aiModels: [],
    alertTypes: [],
  };

  return {
    ...empty,
    ...data,
    owner: ownerFromAuth(),
    cars: data?.cars ?? [],
    alerts: data?.alerts ?? [],
    devices: data?.devices ?? [],
    carServiceConfigs: data?.carServiceConfigs ?? [],
    subscription,
    carLocations: data?.carLocations ?? [],
    aiModels: data?.aiModels ?? [],
    alertTypes: data?.alertTypes ?? [],
  };
}

const DEFAULT_NOTIFICATION_PREFS: OwnerSubscription["notificationPreferences"] =
  [
    {
      channel: "EMAIL",
      label: "Email notifications",
      description: "Receive alerts and summaries via email.",
      enabled: true,
    },
    {
      channel: "SMS",
      label: "SMS notifications",
      description: "Receive critical alerts via text message.",
      enabled: false,
    },
    {
      channel: "PUSH",
      label: "In-app push notifications",
      description: "Receive alerts in the mobile or web app.",
      enabled: true,
    },
  ];

function normalizeSubscription(
  sub?: Partial<OwnerSubscription>
): OwnerSubscription {
  const planId = (sub?.planId as OwnerSubscription["planId"]) || "BASIC";
  const plan =
    OWNER_PLANS.find((p) => p.id === planId) ||
    OWNER_PLANS.find((p) => p.id === "BASIC")!;

  const prefsFromTypes =
    (sub as any)?.notificationTypes &&
    Array.isArray((sub as any).notificationTypes)
      ? mapTypesToPreferences((sub as any).notificationTypes as string[])
      : null;

  const prefs =
    sub?.notificationPreferences && sub.notificationPreferences.length > 0
      ? sub.notificationPreferences
      : prefsFromTypes || DEFAULT_NOTIFICATION_PREFS;

  return {
    planId: plan.id,
    planName: sub?.planName || plan.name,
    pricePerMonth:
      sub?.pricePerMonth !== undefined ? sub.pricePerMonth : plan.pricePerMonth,
    renewalDate: sub?.renewalDate || "",
    notificationPreferences: prefs,
  };
}

function mapTypesToPreferences(
  types: string[]
): OwnerSubscription["notificationPreferences"] {
  const lower = types.map((t) => t.toLowerCase());
  return DEFAULT_NOTIFICATION_PREFS.map((pref) => ({
    ...pref,
    enabled: lower.includes(pref.channel.toLowerCase()),
  }));
}

export async function fetchOwnerDashboard(
  ownerId: string
): Promise<OwnerDashboardData> {
  try {
    const res = await authFetch(
      `/owner/dashboard${ownerId ? `?userId=${ownerId}` : ""}`
    );

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        body?.message || body?.error || "Failed to load owner dashboard"
      );
    }

    const payload = (body?.data ?? {}) as Partial<OwnerDashboardData>;
    console.log("[ownerDashboard] fetched payload", payload);
    return normalizeOwnerDashboard(payload);
  } catch (err) {
    console.warn(
      "Owner dashboard endpoint unavailable, returning empty data",
      err
    );
    return normalizeOwnerDashboard({});
  }
}
