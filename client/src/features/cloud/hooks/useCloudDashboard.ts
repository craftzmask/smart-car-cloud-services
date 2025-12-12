import type { CloudDashboardData } from "../api/cloudDashboardApi";
import { fetchCloudDashboard } from "../api/cloudDashboardApi";
import { useQuery } from "@tanstack/react-query";

export function useCloudDashboard() {
  return useQuery<CloudDashboardData, Error>({
    queryKey: ["cloudDashboard"],
    queryFn: fetchCloudDashboard,
    staleTime: 1000 * 30,
  });
}
