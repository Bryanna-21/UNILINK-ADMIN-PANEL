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
  role: "student" | "lecturer" | "admin" | "superadmin";
  universityId?: string;
}

interface ViewAsSession {
  asRole: "student" | "lecturer" | null;
  originalRole: "admin" | "superadmin";
  startTime: number;
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  hydrated: boolean;
  viewAs: ViewAsSession | null;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
  setHydrated: () => void;
  startViewAs: (asRole: "student" | "lecturer") => void;
  endViewAs: () => void;
}

const TOKEN_KEY = "accessToken";
const USER_KEY = "authUser";
const VIEW_AS_KEY = "viewAsSession";

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  viewAs: null,
  hydrated: false,

  setAuth: (user, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user, token, viewAs: null });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(VIEW_AS_KEY);
    set({ user: null, token: null, viewAs: null });
  },

  setHydrated: () => set({ hydrated: true }),

  startViewAs: (asRole) => {
    const state = get();
    if (!state.user || (state.user.role !== "admin" && state.user.role !== "superadmin")) {
      return;
    }

    const session: ViewAsSession = {
      asRole,
      originalRole: state.user.role as "admin" | "superadmin",
      startTime: Date.now(),
    };

    localStorage.setItem(VIEW_AS_KEY, JSON.stringify(session));
    set({ viewAs: session });
  },

  endViewAs: () => {
    localStorage.removeItem(VIEW_AS_KEY);
    set({ viewAs: null });
  },
}));
