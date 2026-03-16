import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { BGMPlayer } from "@/components/game/BGMPlayer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#ef4444",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "UltraMath - Defense Force",
  description: "Educational Math Tokusatsu Game",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "UltraMath",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/assets/images/ultraman_idle.png" />
      </head>
      <body className={inter.className}>
        {children}
        <BGMPlayer />
      </body>
    </html>
  );
}
