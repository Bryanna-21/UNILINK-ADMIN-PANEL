import { create } from "zustand";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,

  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("accessToken", token);
      window.localStorage.setItem("authUser", JSON.stringify(user));
      document.cookie = `accessToken=${encodeURIComponent(token)}; Path=/; SameSite=Lax`;
    }

    set({ user, token });
  },

  setToken: (token) => {
    let user: AuthUser | null = null;

    if (typeof window !== "undefined") {
      const rawUser = window.localStorage.getItem("authUser");
      if (rawUser) {
        try {
          user = JSON.parse(rawUser) as AuthUser;
        } catch {
          user = null;
        }
      }
    }

    set({ token, user });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("authUser");
      document.cookie = "accessToken=; Path=/; Max-Age=0; SameSite=Lax";
    }

    set({ user: null, token: null });
  },
}));
