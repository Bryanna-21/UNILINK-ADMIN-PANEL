"use client";

import { useEffect } from "react";
import { socket } from "@/services/socket";
import { useNotificationStore } from "@/store/notification.store";
import { useAuthStore } from "@/store/auth.store";

interface SocketNotification {
  message?: string;
}

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const handleNotification = (data: SocketNotification) => {
      if (!data?.message) return;

      addNotification({
        id: crypto.randomUUID(),
        message: data.message,
      });
    };

    if (!socket || !token) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.on("admin-notification", handleNotification);

return () => {
  if (socket) {
    socket.off("admin-notification", handleNotification);
    socket.disconnect();
  }
};
  }, [addNotification, token]);

  return children;
}
