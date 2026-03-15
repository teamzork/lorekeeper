import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "./ConvexClientProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lorekeeper",
  description:
    "Collaborative worldbuilding for fiction writers. Build a shared universe bible with AI consistency checking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" className={inter.variable} suppressHydrationWarning>
        <body
          className={`${inter.className} min-h-screen bg-background font-sans antialiased`}
          style={{
            backgroundColor: "hsl(224 71% 4%)",
            color: "hsl(213 31% 91%)",
          }}
        >
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
