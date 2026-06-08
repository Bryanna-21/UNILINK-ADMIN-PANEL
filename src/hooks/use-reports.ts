"use client";

import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";

export function useReports() {
  return useQuery({
    queryKey: ["reports"],

    queryFn: async () => {
      const response =
        await api.get(
          "/admin/reports"
        );

      return response.data;
    },
  });
}
