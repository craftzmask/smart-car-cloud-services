import type { ChartConfig } from "@/components/ui/chart";
import type { Alert } from "@/domain/types";

export function capitalize(alertType: string | undefined | null) {
  if (!alertType) return "Unknown";
  const safe = String(alertType);
  const words = safe.toLowerCase().split("_");
  const result = [];
  for (const word of words) {
    if (!word) continue;
    result.push(word[0].toUpperCase() + word.slice(1));
  }
  return result.join(" ") || "Unknown";
}

export function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getAlertTypeChartDatas(alerts: Alert[]) {
  const alertTypes = new Set(alerts.map((alert) => alert.type));
export function getChartDatas(alerts: Alert[]) {
  // normalize type, fallback to alert.alertType or "unknown"
  const normalized = alerts.map((alert) => alert.type || (alert as any).alertType || "unknown");
  const alertTypes = new Set(normalized);

  const chartData = [...alertTypes].map((alertType) => {
    const count = normalized.filter((type) => type === alertType).length;
    return {
      type: alertType,
      quantity: count,
      fill: `var(--color-${alertType})`,
    };
  });

  const chartConfig = Object.fromEntries(
    [...alertTypes].map((alertType, idx) => [
      alertType,
      {
        label: capitalize(alertType),
        color: `var(--chart-${idx + 1})`,
      },
    ])
  ) satisfies ChartConfig;

  return {
    chartData,
    chartConfig,
  };
}

export function getAlertSeverityChartDatas(alerts: Alert[]) {
  const alertSeverities = new Set(alerts.map((alert) => alert.severity));
  const chartData = [...alertSeverities].map((severity) => {
    return {
      severity: severity,
      quantity: alerts.filter((alert) => alert.severity === severity).length,
      fill: `var(--color-${severity})`,
    };
  });

  const chartConfig = Object.fromEntries(
    [...alertSeverities].map((severity, idx) => [
      severity,
      {
        label: capitalize(severity),
        color: `var(--chart-${idx + 1})`,
      },
    ])
  ) satisfies ChartConfig;

  return {
    chartData,
    chartConfig,
  };
}

export function formatPrettyDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", // Dec
    day: "numeric", // 15
    year: "numeric", // 2025
  }).format(date);
}

export function getLastNDaysRangeLabel(n: number): string {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (n - 1));
  return `${formatPrettyDate(start)} - ${formatPrettyDate(end)}`;
}

export function filterAlertsByDays(alerts: Alert[], days: number): Alert[] {
  const now = Date.now();
  const msInDay = 24 * 60 * 60 * 1000;
  const cutoff = now - days * msInDay;

  return alerts.filter((alert) => {
    const createdTime = new Date(alert.createdAt).getTime();
    return createdTime >= cutoff;
  });
}
