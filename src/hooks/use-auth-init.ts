"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { setAccessToken } from "@/lib/token-manager";

export function useAuthInit() {
  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const storedToken = window.localStorage.getItem("accessToken");

    if (storedToken) {
      setToken(storedToken);
      setAccessToken(storedToken);
    }
  }, [setToken]);

  useEffect(() => {
    if (token) {
      setAccessToken(token);
    }
  }, [token]);
}
