"use client";

import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],

    queryFn: async () => {
      const response =
        await api.get(
          "/admin/analytics"
        );

      return response.data;
    },
  });
}
