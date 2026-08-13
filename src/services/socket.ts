import { io, Socket } from "socket.io-client";

// Lazily-created singleton. Unlike the previous version, this does NOT
// connect at module-import time — the backend socket server (see
// src/socket.js in UNILINK-BACKEND) rejects any connection that doesn't
// present a valid admin JWT on the handshake, so connecting before
// login would just fail (and spam reconnect attempts) every time.
//
// connectSocket() is called from AuthProvider once a token is known to
// exist (see providers/auth-provider.tsx), and disconnectSocket() is
// called on logout.
let socket: Socket | null = null;

export function connectSocket(token: string): Socket {
  if (socket?.connected) return socket;

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
    auth: { token },
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket(): Socket | null {
  return socket;
}
