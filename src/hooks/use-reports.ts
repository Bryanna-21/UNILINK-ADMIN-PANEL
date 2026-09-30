"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getReports, setReportStatus, type ReportStatus } from "@/services/report.service";

export function useReports(status?: ReportStatus) {
  return useQuery({
    queryKey: ["reports", status],
    queryFn: () => getReports(status),
  });
}

export function useSetReportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, status }: { reportId: string; status: "RESOLVED" | "DISMISSED" }) =>
      setReportStatus(reportId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
