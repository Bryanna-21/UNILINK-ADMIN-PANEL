"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { setStudentStatus } from "@/services/student.service";

// Note: there is no useDeleteStudent here. The backend deliberately
// does not expose a hard-delete endpoint for students (see
// student.service.ts) — only status changes, which are reversible.
export function useSetStudentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentId, status }: { studentId: string; status: "active" | "suspended" }) =>
      setStudentStatus(studentId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
