"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getReports, setReportStatus } from "@/services/report.service";

export function useReports(status?: "open" | "resolved" | "dismissed") {
  return useQuery({
    queryKey: ["reports", status],
    queryFn: () => getReports(status),
  });
}

export function useSetReportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, status }: { reportId: string; status: "open" | "resolved" | "dismissed" }) =>
      setReportStatus(reportId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
