"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudents } from "@/services/student.service";

export function useStudents(
  page: number,
  search: string
) {
  return useQuery({
    queryKey: [
      "students",
      page,
      search,
    ],

    queryFn: () =>
      getStudents(
        page,
        search
      ),

    staleTime: 1000 * 60 * 5,
  });
}
