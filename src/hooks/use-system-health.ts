"use client";

import { useQuery } from "@tanstack/react-query";
import { getSystemHealth } from "@/services/system.service";

export function useSystemHealth() {
  return useQuery({
    queryKey: ["system-health"],
    queryFn: getSystemHealth,
    // System health is exactly the kind of data that goes stale fast
    // and where staleness is actively misleading — poll it.
    refetchInterval: 30_000,
  });
}
