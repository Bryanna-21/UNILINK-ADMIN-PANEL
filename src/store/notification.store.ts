import { create } from "zustand";

export interface LiveNotification {
  id: string;
  type?: string;
  title?: string;
  message: string;
  link?: string;
  createdAt?: string;
}

interface NotificationStore {
  notifications: LiveNotification[];
  addNotification: (notification: LiveNotification) => void;
  clear: () => void;
}

// Holds live, socket-pushed notifications for the current session only.
// This is NOT the source of truth for the Notifications page (that's
// GET /api/admin/notifications, backed by MongoDB) — this store exists
// so an admin who is actively looking at the panel sees a toast/badge
// the instant an event happens, without waiting for a refetch. On page
// load or refresh this store starts empty and the Notifications page
// hydrates from the real API instead.
export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 20),
    })),

  clear: () => set({ notifications: [] }),
}));
