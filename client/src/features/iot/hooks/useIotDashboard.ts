import { useQuery } from "@tanstack/react-query";
import { fetchIotDashboard, type IotDashboardData } from "../api/iotDashboardApi";

export function useIotDashboard() {
  return useQuery<IotDashboardData, Error>({
    queryKey: ["iotDashboard"],
    queryFn: fetchIotDashboard,
    staleTime: 30_000,
  });
}
