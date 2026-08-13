import "./globals.css";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

import AuthProvider from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-provider";
import SocketProvider from "@/providers/socket-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import ErrorBoundary from "@/components/common/error-boundary";
import GlobalModal from "@/components/common/global-modal";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "UniLink Admin",
  description: "UniLink Administration Panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ErrorBoundary>
          <ThemeProvider>
            <QueryProvider>
              <AuthProvider>
                <SocketProvider>
                  {children}
                  <GlobalModal />
                </SocketProvider>
              </AuthProvider>
            </QueryProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
