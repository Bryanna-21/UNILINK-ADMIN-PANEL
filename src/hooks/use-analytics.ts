"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserGrowth, getUniversityGrowth } from "@/services/analytics.service";

export function useUserGrowth(days = 30) {
  return useQuery({
    queryKey: ["user-growth", days],
    queryFn: () => getUserGrowth("day", days),
  });
}

export function useUniversityGrowth() {
  return useQuery({
    queryKey: ["university-growth"],
    queryFn: () => getUniversityGrowth("month"),
  });
}
