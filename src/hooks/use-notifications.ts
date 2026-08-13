"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getNotifications, markNotificationRead } from "@/services/notification.service";

export function useNotifications(unreadOnly = false) {
  return useQuery({
    queryKey: ["notifications", unreadOnly],
    queryFn: () => getNotifications(unreadOnly),
    // Polling fallback in case the socket connection drops — the REST
    // endpoint stays the source of truth either way (see
    // notification.store.ts for why the socket-pushed list is
    // session-only, not persisted).
    refetchInterval: 60_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
