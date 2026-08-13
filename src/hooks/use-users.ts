"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getUsers, setUserStatus, UserQueryParams } from "@/services/user.service";

export function useUsers(params: UserQueryParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    staleTime: 1000 * 60,
  });
}

export function useSetUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: "active" | "suspended" }) =>
      setUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // A user's status can also affect the Students page if the same
      // account happens to be a student — keep both views consistent.
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
