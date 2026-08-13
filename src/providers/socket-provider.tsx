"use client";

import { useEffect } from "react";

import { getSocket } from "@/services/socket";

import { useNotificationStore } from "@/store/notification.store";
import { useAuthStore } from "@/store/auth.store";

// Attaches the "admin-notification" listener whenever a socket
// connection exists. The connection itself is established by
// AuthProvider once login succeeds (see providers/auth-provider.tsx) —
// this component only listens, it does not connect.
export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const addNotification = useNotificationStore((state) => state.addNotification);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNotification = (data: {
      type?: string;
      title?: string;
      message: string;
      link?: string;
      createdAt?: string;
    }) => {
      addNotification({
        id: crypto.randomUUID(),
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link,
        createdAt: data.createdAt,
      });
    };

    socket.on("admin-notification", handleNotification);

    return () => {
      socket.off("admin-notification", handleNotification);
    };
    // Re-run when the token changes (login/logout), since that's when
    // the underlying socket connection is created/destroyed.
  }, [addNotification, token]);

  return children;
}
