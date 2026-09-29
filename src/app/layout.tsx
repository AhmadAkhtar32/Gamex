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

const SITE_TITLE =
  "GameX Pakistan | Gaming PCs, Custom Builds & PC Accessories";

const SITE_DESCRIPTION =
  "Shop gaming PCs, custom PC builds, graphics cards, processors, RAM, SSDs, gaming keyboards, mice, headsets and PC accessories in Pakistan from GameX.";

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
   GLOBAL SEO METADATA
   ========================================================= */

export const metadata: Metadata = {
  metadataBase:
    new URL(
      SITE_URL
    ),

  /* =======================================================
     TITLE
     ======================================================= */

  title: {
    default:
      SITE_TITLE,

    template:
      "%s | GameX Pakistan",
  },

  /* =======================================================
     DESCRIPTION
     ======================================================= */

  description:
    SITE_DESCRIPTION,

  applicationName:
    SITE_NAME,

  /* =======================================================
     CANONICAL
     ======================================================= */

  alternates: {
    canonical:
      "/",
  },

  /* =======================================================
     BRAND
     ======================================================= */

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
     SEARCH ENGINE ROBOTS
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
     OPEN GRAPH
     Facebook / WhatsApp / LinkedIn previews
     ======================================================= */

  openGraph: {
    type:
      "website",

    locale:
      "en_PK",

    url:
      SITE_URL,

    siteName:
      "GameX Pakistan",

    title:
      SITE_TITLE,

    description:
      SITE_DESCRIPTION,

    images: [
      {
        url:
          "/icon.png",

        width:
          512,

        height:
          512,

        alt:
          "GameX Pakistan - Gaming PCs, Custom Builds and PC Accessories",
      },
    ],
  },

  /* =======================================================
     TWITTER / X
     ======================================================= */

  twitter: {
    card:
      "summary_large_image",

    title:
      SITE_TITLE,

    description:
      SITE_DESCRIPTION,

    images: [
      "/icon.png",
    ],
  },

  /* =======================================================
     FAVICON
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
   STRUCTURED DATA
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
        "GameX Pakistan provides gaming PCs, custom PC builds, computer components and gaming accessories in Pakistan.",
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
        SITE_DESCRIPTION,

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
        {/* =================================================
            ORGANIZATION + WEBSITE STRUCTURED DATA
            ================================================= */}

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
          {
            children
          }

          {/* ===============================================
              GLOBAL WHATSAPP BUTTON
              =============================================== */}

          <WhatsAppFloat />
        </Chrome>
      </body>
    </html>
  );
}