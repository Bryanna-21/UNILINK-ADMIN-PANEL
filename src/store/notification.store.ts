import { create } from "zustand";

export interface Notification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "createdAt" | "read"> & Partial<Pick<Notification, "createdAt" | "read">>) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          createdAt: notification.createdAt ?? new Date().toISOString(),
          read: notification.read ?? false,
        },
        ...state.notifications,
      ],
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification,
      ),
    })),

  clearNotifications: () => set({ notifications: [] }),
}));
