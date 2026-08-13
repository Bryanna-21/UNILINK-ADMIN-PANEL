"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "@/services/audit.service";

export function useAuditLogs(page: number) {
  return useQuery({
    queryKey: ["audit-logs", page],
    queryFn: () => getAuditLogs(page),
  });
}
