import type {
  Metadata,
} from "next";

/* =========================================================
   ADMIN SEO
   ========================================================= */

export const metadata: Metadata = {
  title:
    "Admin",

  robots: {
    index:
      false,

    follow:
      false,

    googleBot: {
      index:
        false,

      follow:
        false,
    },
  },
};

/* =========================================================
   ADMIN LAYOUT
   ========================================================= */

export default function AdminLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}