import { io, Socket } from "socket.io-client";

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

export const socket: Socket | null = socketUrl
  ? io(socketUrl, {
      transports: ["websocket"],
      autoConnect: false,
      withCredentials: true,
    })
  : null;
