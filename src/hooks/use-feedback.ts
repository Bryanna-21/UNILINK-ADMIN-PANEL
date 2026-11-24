"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getFeedback, setFeedbackStatus } from "@/services/feedback.service";
import type { FeedbackFilter, FeedbackStatus } from "@/lib/feedback-view";

// The list refreshes by itself every 30 seconds and whenever the server signals a new report (providers/socket-provider.tsx).
export function useFeedback(status: FeedbackFilter, page: number) {
  return useQuery({
    queryKey: ["feedback", status, page],
    queryFn: () => getFeedback(status, page),
    refetchInterval: 30_000,
    placeholderData: keepPreviousData,
  });
}

// How many reports are still new, for the badge in the sidebar.
export function useFeedbackNewCount(enabled = true) {
  return useQuery({
    queryKey: ["feedback-count"],
    queryFn: async () => (await getFeedback("new", 1, 1)).counts.new,
    enabled,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useSetFeedbackStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: FeedbackStatus }) => setFeedbackStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
      queryClient.invalidateQueries({ queryKey: ["feedback-count"] });
    },
  });
}
