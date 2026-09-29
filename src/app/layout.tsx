import type {
  Metadata,
} from "next";

import {
  Orbitron,
  Google_Sans_Flex,
} from "next/font/google";

import "./globals.css";

import {
  Chrome,
} from "@/components/chrome";

import {
  WhatsAppFloat,
} from "@/components/WhatsAppFloat";

/* =========================================================
   SITE
   ========================================================= */

const SITE_URL =
  "https://gamex.pk";

const SITE_NAME =
  "GameX";

const DEFAULT_SITE_TITLE =
  "GameX Pakistan";

const DEFAULT_SITE_DESCRIPTION =
  "GameX Pakistan provides gaming PCs, custom gaming builds, PC components and gaming accessories in Pakistan.";

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

const googleSans =
  Google_Sans_Flex({
    subsets: [
      "latin",
    ],

    weight:
      "500",

    variable:
      "--font-google-sans",

    display:
      "swap",
  });

/* =========================================================
   GLOBAL METADATA

   IMPORTANT:
   Do not put a homepage canonical or homepage URL here.
   Individual pages control their own canonical URLs.
   ========================================================= */

export const metadata: Metadata = {
  metadataBase:
    new URL(
      SITE_URL
    ),

  title: {
    default:
      DEFAULT_SITE_TITLE,

    template:
      "%s | GameX Pakistan",
  },

  description:
    DEFAULT_SITE_DESCRIPTION,

  applicationName:
    SITE_NAME,

  authors: [
    {
      name:
        "GameX",

      url:
        SITE_URL,
    },
  ],

  creator:
    "GameX",

  publisher:
    "GameX",

  /* =======================================================
     DEFAULT ROBOTS

     Individual layouts/pages can override this.
     Admin will override it with noindex.
     ======================================================= */

  robots: {
    index:
      true,

    follow:
      true,

    googleBot: {
      index:
        true,

      follow:
        true,

      "max-image-preview":
        "large",

      "max-snippet":
        -1,

      "max-video-preview":
        -1,
    },
  },

  /* =======================================================
     SITE-WIDE OPEN GRAPH BASICS

     Page-specific URL/title/description belong on each page.
     ======================================================= */

  openGraph: {
    type:
      "website",

    locale:
      "en_PK",

    siteName:
      "GameX Pakistan",
  },

  /* =======================================================
     FAVICON
     ======================================================= */

  icons: {
    icon:
      "/icon.png",
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
   GLOBAL STRUCTURED DATA
   ========================================================= */

const structuredData = {
  "@context":
    "https://schema.org",

  "@graph": [
    {
      "@type":
        "Organization",

      "@id":
        `${SITE_URL}/#organization`,

      name:
        "GameX",

      alternateName:
        "GameX Pakistan",

      url:
        SITE_URL,

      logo: {
        "@type":
          "ImageObject",

        url:
          `${SITE_URL}/icon.png`,
      },

      description:
        DEFAULT_SITE_DESCRIPTION,
    },

    {
      "@type":
        "WebSite",

      "@id":
        `${SITE_URL}/#website`,

      url:
        SITE_URL,

      name:
        "GameX Pakistan",

      alternateName:
        "GameX",

      description:
        DEFAULT_SITE_DESCRIPTION,

      publisher: {
        "@id":
          `${SITE_URL}/#organization`,
      },

      inLanguage:
        "en-PK",
    },
  ],
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
      lang="en-PK"
      className={`
        ${orbitron.variable}
        ${googleSans.variable}
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                structuredData
              ),
          }}
        />

        <Chrome>
          {children}

          <WhatsAppFloat />
        </Chrome>
      </body>
    </html>
  );
}