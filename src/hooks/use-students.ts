"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudents, StudentQueryParams } from "@/services/student.service";

export function useStudents(params: StudentQueryParams) {
  return useQuery({
    queryKey: ["students", params],
    queryFn: () => getStudents(params),
    staleTime: 1000 * 60,
  });
}
