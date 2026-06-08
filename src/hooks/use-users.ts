"use client";

import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],

    queryFn: async () => {
      const response =
        await api.get(
          "/admin/users"
        );

      return response.data;
    },
  });
}
