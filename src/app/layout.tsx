import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Orbitron, Rajdhani } from "next/font/google";
import { Chrome } from "@/components/chrome";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-rajdhani",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gamex Custom Gaming PCs, GPUs, RAM, CPUs & Pro Accessories",
  description:
    "Gamex is a premium gaming hardware brand. Custom-built PCs, graphics cards, memory, processors and pro-grade accessories — engineered for players who refuse to lose.",
  keywords: [
    "Gamex",
    "custom gaming PC",
    "graphics cards",
    "GPU",
    "RAM",
    "memory",
    "processors",
    "gaming accessories",
    "esports",
  ],
  openGraph: {
    title: "Gamex — Forge Your Victory",
    description:
      "Custom-built gaming PCs and pro-grade components. Graphics cards, memory, processors and accessories engineered for peak performance.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${rajdhani.variable}`}
    >
      <body className="bg-white font-body text-slate-700 antialiased">
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}