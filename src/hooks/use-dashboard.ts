"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getRecentUsers } from "@/services/dashboard.service";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });
}

export function useRecentUsers() {
  return useQuery({
    queryKey: ["recent-users"],
    queryFn: () => getRecentUsers(8),
  });
}
