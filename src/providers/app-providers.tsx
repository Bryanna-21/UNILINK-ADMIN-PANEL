"use client";

import { ReactNode } from "react";
import AuthProvider from "./auth-provider";
import QueryProvider from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import SocketProvider from "./socket-provider";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <SocketProvider>{children}</SocketProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
