import type { Metadata } from "next";
import { Lora, Courier_Prime } from "next/font/google";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "./ConvexClientProvider";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier-prime",
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
      <html
        lang="en"
        className={`${lora.variable} ${courierPrime.variable}`}
        suppressHydrationWarning
      >
        <body
          className={`${lora.className} min-h-screen bg-background font-serif antialiased`}
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
