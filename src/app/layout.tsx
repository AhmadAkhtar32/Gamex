import type {
  Metadata,
} from "next";

import {
  Orbitron,
  Rajdhani,
} from "next/font/google";

import "./globals.css";

import {
  Chrome,
} from "@/components/chrome";

import {
  WhatsAppFloat,
} from "@/components/WhatsAppFloat";

/* =========================================================
   FONTS
   ========================================================= */

const orbitron =
  Orbitron({
    subsets: [
      "latin",
    ],

    variable:
      "--font-orbitron",

    display:
      "swap",
  });

const rajdhani =
  Rajdhani({
    subsets: [
      "latin",
    ],

    weight: [
      "300",
      "400",
      "500",
      "600",
      "700",
    ],

    variable:
      "--font-rajdhani",

    display:
      "swap",
  });

/* =========================================================
   SITE METADATA
   ========================================================= */

export const metadata: Metadata = {
  metadataBase:
    new URL(
      "https://gamex.pk"
    ),

  title: {
    default:
      "Gamex Custom Gaming",

    template:
      "%s | Gamex",
  },

  description:
    "Gamex offers high-performance gaming hardware, custom gaming PCs, GPUs, processors, memory, accessories and expert gaming support.",

  applicationName:
    "Gamex",

  keywords: [
    "Gamex",
    "Gaming PC Pakistan",
    "Custom Gaming PC",
    "Gaming Hardware",
    "Graphics Cards",
    "GPU Pakistan",
    "Gaming Accessories",
    "PC Components",
    "Custom PC Lahore",
  ],

  authors: [
    {
      name:
        "Gamex",
    },
  ],

  creator:
    "Gamex",

  publisher:
    "Gamex",

  /* =======================================================
     OPEN GRAPH
     ======================================================= */

  openGraph: {
    type:
      "website",

    locale:
      "en_PK",

    url:
      "https://gamex.pk",

    siteName:
      "Gamex",

    title:
      "Gamex Custom Gaming",

    description:
      "High-performance gaming hardware and custom gaming PCs built for gamers who demand more.",
  },

  /* =======================================================
     TWITTER / X
     ======================================================= */

  twitter: {
    card:
      "summary_large_image",

    title:
      "Gamex Custom Gaming",

    description:
      "High-performance gaming hardware and custom gaming PCs.",
  },

  /* =======================================================
     FAVICON

     Next.js will also automatically detect:
     src/app/icon.png
     src/app/apple-icon.png
     ======================================================= */

  icons: {
    icon:
      "/icon.png",

    apple:
      "/apple-icon.png",
  },
};

/* =========================================================
   VIEWPORT
   ========================================================= */

export const viewport = {
  width:
    "device-width",

  initialScale:
    1,

  maximumScale:
    5,

  themeColor:
    "#ffffff",
};

/* =========================================================
   ROOT LAYOUT
   ========================================================= */

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${orbitron.variable}
        ${rajdhani.variable}
      `}
      suppressHydrationWarning
    >
      <body
        className="
          min-h-screen
          bg-white
          text-slate-800
          antialiased
        "
      >
        <Chrome>
          {children}

          {/* ===============================================
              GLOBAL WHATSAPP BUTTON

              This renders on every page:
              /
              /blog
              /blog/...
              /admin
              etc.
              =============================================== */}

          <WhatsAppFloat />
        </Chrome>
      </body>
    </html>
  );
}