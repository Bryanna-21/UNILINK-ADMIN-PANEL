"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getUniversities, setUniversityVerified } from "@/services/university.service";

export function useUniversities(params: { search?: string; verified?: "true" | "false" } = {}) {
  return useQuery({
    queryKey: ["universities", params],
    queryFn: () => getUniversities(params),
  });
}

export function useSetUniversityVerified() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ universityId, verified }: { universityId: string; verified: boolean }) =>
      setUniversityVerified(universityId, verified),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["universities"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
