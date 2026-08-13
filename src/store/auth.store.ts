import { create } from "zustand";

// Matches exactly what the backend's /api/auth/login returns (see
// UNILINK-BACKEND src/routes/auth.routes.js) — id, name, email, role,
// universityId. Do not add fields here that the backend doesn't
// actually send; that's how the accessToken/token mismatch bug
// happened in the first place.
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "lecturer" | "admin";
  universityId?: string;
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  hydrated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
  setHydrated: () => void;
}

const TOKEN_KEY = "accessToken";
const USER_KEY = "authUser";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  // False until useAuthInit has read localStorage once. Protected pages
  // must wait for hydrated === true before deciding to redirect, or
  // every refresh briefly "logs out" a real session (see
  // dashboard-layout.tsx for how this is used).
  hydrated: false,

  setAuth: (user, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null, token: null });
  },

  setHydrated: () => set({ hydrated: true }),
}));
