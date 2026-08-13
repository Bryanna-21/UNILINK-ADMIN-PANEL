"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/store/auth.store";
import { connectSocket, disconnectSocket } from "@/services/socket";

// Runs once on app mount (see providers/auth-provider.tsx). Two jobs:
//
// 1. Rehydrate the zustand store from localStorage. Zustand's in-memory
//    state always starts as { user: null, token: null } on a fresh page
//    load/refresh, even for an already-logged-in admin — localStorage
//    is the durable source of truth, zustand is just the reactive
//    mirror of it for this session. Without this step, every refresh
//    looks like a logged-out user until this effect runs.
// 2. Connect the notifications socket once we know a token exists, and
//    disconnect it on logout.
export function useAuthInit() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setHydrated = useAuthStore((state) => state.setHydrated);
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);

  // Step 1: rehydrate once on mount.
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("authUser");

      if (storedToken && storedUser) {
        setAuth(JSON.parse(storedUser), storedToken);
      }
    } catch {
      // Corrupted localStorage value — treat as logged out rather than
      // crash the app on a JSON.parse failure.
      logout();
    } finally {
      setHydrated();
    }
    // Intentionally run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Step 2: keep the socket connection in sync with whether we have a token.
  useEffect(() => {
    if (token) {
      connectSocket(token);
    } else {
      disconnectSocket();
    }
  }, [token]);
}
