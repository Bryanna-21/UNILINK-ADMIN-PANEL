"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudentById } from "@/services/student.service";

export function useStudent(studentId: string) {
  return useQuery({
    queryKey: ["student", studentId],
    queryFn: () => getStudentById(studentId),
    enabled: !!studentId,
  });
}
