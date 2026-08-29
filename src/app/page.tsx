import {
  asc,
  eq,
} from "drizzle-orm";

import { db } from "@/db";

import {
  contactSettings as contactSettingsTable,
  contactSocialLinks as contactSocialLinksTable,
  customBuilds as buildsTable,
  featuresSettings as featuresSettingsTable,
  heroSettings as heroSettingsTable,
  homepageFeatures as featuresTable,
  homepageStats as statsTable,
  navbarLinks as navbarLinksTable,
  navbarSettings as navbarSettingsTable,
  products as productsTable,
} from "@/db/schema";

import {
  Navbar,
  DEFAULT_NAVBAR_LINKS,
  DEFAULT_NAVBAR_SETTINGS,
} from "@/components/Navbar";

import {
  Hero,
} from "@/components/Hero";

import {
  Marquee,
  ScrollProgress,
} from "@/components/ui";

import {
  Stats,
} from "@/components/Stats";

import Products from "@/components/Products";

import {
  Builds,
} from "@/components/Builds";

import {
  Features,
} from "@/components/Features";

import {
  Blog,
} from "@/components/Blog";

import {
  Contact,
  DEFAULT_CONTACT_CONTENT,
} from "@/components/Contact";

import {
  Footer,
} from "@/components/Footer";

import {
  getBlogPosts,
} from "@/lib/blog";

import {
  DEFAULT_HERO_CONTENT,
} from "@/lib/hero-content";

/* =========================================================
   FORCE FRESH DATABASE CONTENT
   ========================================================= */

export const dynamic =
  "force-dynamic";

/* =========================================================
   DEFAULT FEATURES SETTINGS
   ========================================================= */

const DEFAULT_FEATURES_SETTINGS = {
  eyebrow:
    "Why Gamex",

  title:
    "Built Different.",

  subtitle:
    "Everything we do is focused on delivering reliable, high-performance gaming hardware with the support to match.",

  isVisible:
    true,
};

/* =========================================================
   HOMEPAGE
   ========================================================= */

export default async function HomePage() {
  /* =======================================================
     NAVBAR SETTINGS
     ======================================================= */

  const navbarSettingsRows =
    await db
      .select({
        brandText:
          navbarSettingsTable.brandText,

        brandHref:
          navbarSettingsTable.brandHref,

        logoImage:
          navbarSettingsTable.logoImage,

        logoAlt:
          navbarSettingsTable.logoAlt,

        ctaText:
          navbarSettingsTable.ctaText,

        ctaHref:
          navbarSettingsTable.ctaHref,

        ctaVisible:
          navbarSettingsTable.ctaVisible,

        isVisible:
          navbarSettingsTable.isVisible,
      })
      .from(
        navbarSettingsTable
      )
      .where(
        eq(
          navbarSettingsTable.id,
          "main"
        )
      )
      .limit(1);

  /* =======================================================
     NAVBAR LINKS
     ======================================================= */

  const databaseNavbarLinks =
    await db
      .select({
        id:
          navbarLinksTable.id,

        label:
          navbarLinksTable.label,

        href:
          navbarLinksTable.href,
      })
      .from(
        navbarLinksTable
      )
      .where(
        eq(
          navbarLinksTable.isVisible,
          true
        )
      )
      .orderBy(
        asc(
          navbarLinksTable.sortOrder
        ),
        asc(
          navbarLinksTable.id
        )
      );

  /*
   * Before the Navbar has ever been configured in Admin,
   * preserve the original website.
   *
   * Once Navbar settings exist in Neon, the database becomes
   * the source of truth.
   *
   * This is important because an Admin may intentionally
   * delete all navigation links.
   */

  const navbarHasDatabaseSettings =
    Boolean(
      navbarSettingsRows[0]
    );

  const navbarContent =
    navbarSettingsRows[0] ??
    DEFAULT_NAVBAR_SETTINGS;

  const publicNavbarLinks =
    navbarHasDatabaseSettings
      ? databaseNavbarLinks
      : databaseNavbarLinks.length >
          0
        ? databaseNavbarLinks
        : DEFAULT_NAVBAR_LINKS;

  /* =======================================================
     HERO
     ======================================================= */

  const heroRows =
    await db
      .select()
      .from(
        heroSettingsTable
      )
      .where(
        eq(
          heroSettingsTable.id,
          "main"
        )
      )
      .limit(1);

  const heroContent =
    heroRows[0] ??
    DEFAULT_HERO_CONTENT;

  /* =======================================================
     HOMEPAGE STATS
     ======================================================= */

  const databaseStats =
    await db
      .select({
        id:
          statsTable.id,

        value:
          statsTable.value,

        label:
          statsTable.label,
      })
      .from(
        statsTable
      )
      .where(
        eq(
          statsTable.isVisible,
          true
        )
      )
      .orderBy(
        asc(
          statsTable.sortOrder
        ),
        asc(
          statsTable.id
        )
      );

  /* =======================================================
     PRODUCTS
     ======================================================= */

  const databaseProducts =
    await db
      .select()
      .from(
        productsTable
      )
      .where(
        eq(
          productsTable.isVisible,
          true
        )
      )
      .orderBy(
        asc(
          productsTable.sortOrder
        ),
        asc(
          productsTable.name
        )
      );

  /* =======================================================
     CUSTOM BUILDS
     ======================================================= */

  const databaseBuilds =
    await db
      .select()
      .from(
        buildsTable
      )
      .where(
        eq(
          buildsTable.isVisible,
          true
        )
      )
      .orderBy(
        asc(
          buildsTable.sortOrder
        ),
        asc(
          buildsTable.name
        )
      );

  /* =======================================================
     FEATURES SECTION SETTINGS
     ======================================================= */

  const featuresSettingsRows =
    await db
      .select({
        eyebrow:
          featuresSettingsTable.eyebrow,

        title:
          featuresSettingsTable.title,

        subtitle:
          featuresSettingsTable.subtitle,

        isVisible:
          featuresSettingsTable.isVisible,
      })
      .from(
        featuresSettingsTable
      )
      .where(
        eq(
          featuresSettingsTable.id,
          "main"
        )
      )
      .limit(1);

  const featuresContent =
    featuresSettingsRows[0] ??
    DEFAULT_FEATURES_SETTINGS;

  /* =======================================================
     FEATURE CARDS
     ======================================================= */

  const databaseFeatures =
    await db
      .select({
        id:
          featuresTable.id,

        icon:
          featuresTable.icon,

        title:
          featuresTable.title,

        description:
          featuresTable.description,
      })
      .from(
        featuresTable
      )
      .where(
        eq(
          featuresTable.isVisible,
          true
        )
      )
      .orderBy(
        asc(
          featuresTable.sortOrder
        ),
        asc(
          featuresTable.id
        )
      );

  /* =======================================================
     BLOG POSTS
     ======================================================= */

  const posts =
    await getBlogPosts();

  /* =======================================================
     CONTACT SETTINGS
     ======================================================= */

  const contactRows =
    await db
      .select({
        eyebrow:
          contactSettingsTable.eyebrow,

        title:
          contactSettingsTable.title,

        subtitle:
          contactSettingsTable.subtitle,

        emailLabel:
          contactSettingsTable.emailLabel,

        email:
          contactSettingsTable.email,

        phoneLabel:
          contactSettingsTable.phoneLabel,

        phone:
          contactSettingsTable.phone,

        addressLabel:
          contactSettingsTable.addressLabel,

        address:
          contactSettingsTable.address,

        hoursLabel:
          contactSettingsTable.hoursLabel,

        hours:
          contactSettingsTable.hours,

        socialHeading:
          contactSettingsTable.socialHeading,

        nameLabel:
          contactSettingsTable.nameLabel,

        namePlaceholder:
          contactSettingsTable.namePlaceholder,

        formEmailLabel:
          contactSettingsTable.formEmailLabel,

        formEmailPlaceholder:
          contactSettingsTable.formEmailPlaceholder,

        subjectLabel:
          contactSettingsTable.subjectLabel,

        subjectPlaceholder:
          contactSettingsTable.subjectPlaceholder,

        messageLabel:
          contactSettingsTable.messageLabel,

        messagePlaceholder:
          contactSettingsTable.messagePlaceholder,

        submitButtonText:
          contactSettingsTable.submitButtonText,

        isVisible:
          contactSettingsTable.isVisible,
      })
      .from(
        contactSettingsTable
      )
      .where(
        eq(
          contactSettingsTable.id,
          "main"
        )
      )
      .limit(1);

  const contactContent =
    contactRows[0] ??
    DEFAULT_CONTACT_CONTENT;

  /* =======================================================
     CONTACT SOCIAL LINKS
     ======================================================= */

  const databaseSocialLinks =
    await db
      .select({
        id:
          contactSocialLinksTable.id,

        platform:
          contactSocialLinksTable.platform,

        url:
          contactSocialLinksTable.url,
      })
      .from(
        contactSocialLinksTable
      )
      .where(
        eq(
          contactSocialLinksTable.isVisible,
          true
        )
      )
      .orderBy(
        asc(
          contactSocialLinksTable.sortOrder
        ),
        asc(
          contactSocialLinksTable.id
        )
      );

  /* =======================================================
     HOMEPAGE
     ======================================================= */

  return (
    <>
      <ScrollProgress />

      {/* ===================================================
          DATABASE-DRIVEN NAVBAR
          =================================================== */}

      <Navbar
        settings={
          navbarContent
        }
        links={
          publicNavbarLinks
        }
      />

      <main
        className="
          relative
          bg-white
        "
      >
        {/* HERO */}

        <Hero
          content={
            heroContent
          }
        />

        {/* MARQUEE */}

        <Marquee />

        {/* STATS */}

        <Stats
          stats={
            databaseStats
          }
        />

        {/* PRODUCTS */}

        <Products
          products={
            databaseProducts
          }
        />

        {/* CUSTOM BUILDS */}

        <Builds
          builds={
            databaseBuilds
          }
        />

        {/* FEATURES */}

        <Features
          settings={
            featuresContent
          }
          features={
            databaseFeatures
          }
        />

        {/* SECOND MARQUEE */}

        <Marquee reverse />

        {/* BLOG */}

        <Blog
          posts={
            posts
          }
        />

        {/* CONTACT */}

        <Contact
          content={
            contactContent
          }
          socialLinks={
            databaseSocialLinks
          }
        />
      </main>

      <Footer />
    </>
  );
}