"use client";

import { useEffect } from "react";

import { socket } from "@/services/socket";

import { useNotificationStore } from "@/store/notification.store";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const addNotification =
    useNotificationStore(
      (state) =>
        state.addNotification
    );

  useEffect(() => {
    socket.on(
      "admin-notification",
      (data) => {
        addNotification({
          id: crypto.randomUUID(),
          message: data.message,
        });
      }
    );

    return () => {
      socket.off(
        "admin-notification"
      );
    };
  }, [addNotification]);

  return children;
}
