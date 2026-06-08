"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/store/auth.store";

import { setAccessToken } from "@/lib/token-manager";

export function useAuthInit() {
  const token = useAuthStore(
    (state) => state.token
  );

  useEffect(() => {
    if (token) {
      setAccessToken(token);
    }
  }, [token]);
}
