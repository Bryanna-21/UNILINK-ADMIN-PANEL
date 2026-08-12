import type { Metadata } from "next";
import "./globals.css";
import AppProviders from "@/providers/app-providers";
import GlobalModal from "@/components/common/global-modal";

export const metadata: Metadata = {
  title: "UniLink Admin",
  description: "UniLink Administration Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>
          {children}
          <GlobalModal />
        </AppProviders>
      </body>
    </html>
  );
}
