"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  suspendStudent,
  deleteStudent,
} from "@/services/student.service";

export function useSuspendStudent() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      suspendStudent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "students",
        ],
      });
    },
  });
}

export function useDeleteStudent() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      deleteStudent,

    onMutate: async (
      studentId
    ) => {
      await queryClient.cancelQueries({
        queryKey: [
          "students",
        ],
      });

      const previous =
        queryClient.getQueryData(
          ["students"]
        );

      queryClient.setQueryData(
        ["students"],
        (old: any) => ({
          ...old,

          data:
            old?.data?.filter(
              (
                student: any
              ) =>
                student.id !==
                studentId
            ),
        })
      );

      return {
        previous,
      };
    },

    onError: (
      err,
      studentId,
      context
    ) => {
      queryClient.setQueryData(
        ["students"],
        context?.previous
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "students",
        ],
      });
    },
  });
}
