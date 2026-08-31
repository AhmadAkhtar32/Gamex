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
  footerLinks as footerLinksTable,
  footerSettings as footerSettingsTable,
  footerSocialLinks as footerSocialLinksTable,
  heroSettings as heroSettingsTable,
  homepageFeatures as featuresTable,
  homepageStats as statsTable,
  navbarLinks as navbarLinksTable,
  navbarSettings as navbarSettingsTable,
  products as productsTable,
} from "@/db/schema";

/* =========================================================
   COMPONENTS
   ========================================================= */

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
  DEFAULT_FOOTER_CONTENT,
  DEFAULT_FOOTER_LINKS,
  DEFAULT_FOOTER_SOCIAL_LINKS,
} from "@/components/Footer";

/* =========================================================
   CONTENT HELPERS
   ========================================================= */

import {
  DEFAULT_HERO_CONTENT,
} from "@/lib/hero-content";

import {
  getBlogHomepageData,
} from "@/lib/blog";

/* =========================================================
   ALWAYS LOAD CURRENT DATABASE CONTENT
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
      : databaseNavbarLinks.length > 0
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
     STATS
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
     FEATURES SETTINGS
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
     BLOG
     ======================================================= */

  const {
    content: blogContent,
    posts: blogPosts,
  } =
    await getBlogHomepageData();

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

  const databaseContactSocialLinks =
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
     FOOTER SETTINGS
     ======================================================= */

  const footerSettingsRows =
    await db
      .select({
        brandText:
          footerSettingsTable.brandText,

        brandHref:
          footerSettingsTable.brandHref,

        logoImage:
          footerSettingsTable.logoImage,

        logoAlt:
          footerSettingsTable.logoAlt,

        description:
          footerSettingsTable.description,

        navigationHeading:
          footerSettingsTable.navigationHeading,

        contactHeading:
          footerSettingsTable.contactHeading,

        email:
          footerSettingsTable.email,

        phone:
          footerSettingsTable.phone,

        address:
          footerSettingsTable.address,

        ctaText:
          footerSettingsTable.ctaText,

        ctaHref:
          footerSettingsTable.ctaHref,

        ctaVisible:
          footerSettingsTable.ctaVisible,

        copyrightText:
          footerSettingsTable.copyrightText,

        backToTopText:
          footerSettingsTable.backToTopText,

        backToTopHref:
          footerSettingsTable.backToTopHref,

        isVisible:
          footerSettingsTable.isVisible,
      })
      .from(
        footerSettingsTable
      )
      .where(
        eq(
          footerSettingsTable.id,
          "main"
        )
      )
      .limit(1);

  const footerHasDatabaseSettings =
    Boolean(
      footerSettingsRows[0]
    );

  const footerContent =
    footerSettingsRows[0] ??
    DEFAULT_FOOTER_CONTENT;

  /* =======================================================
     FOOTER LINKS
     ======================================================= */

  const databaseFooterLinks =
    await db
      .select({
        id:
          footerLinksTable.id,

        label:
          footerLinksTable.label,

        href:
          footerLinksTable.href,
      })
      .from(
        footerLinksTable
      )
      .where(
        eq(
          footerLinksTable.isVisible,
          true
        )
      )
      .orderBy(
        asc(
          footerLinksTable.sortOrder
        ),
        asc(
          footerLinksTable.id
        )
      );

  const publicFooterLinks =
    footerHasDatabaseSettings
      ? databaseFooterLinks
      : databaseFooterLinks.length > 0
        ? databaseFooterLinks
        : DEFAULT_FOOTER_LINKS;

  /* =======================================================
     FOOTER SOCIAL LINKS
     ======================================================= */

  const databaseFooterSocialLinks =
    await db
      .select({
        id:
          footerSocialLinksTable.id,

        platform:
          footerSocialLinksTable.platform,

        url:
          footerSocialLinksTable.url,
      })
      .from(
        footerSocialLinksTable
      )
      .where(
        eq(
          footerSocialLinksTable.isVisible,
          true
        )
      )
      .orderBy(
        asc(
          footerSocialLinksTable.sortOrder
        ),
        asc(
          footerSocialLinksTable.id
        )
      );

  const publicFooterSocialLinks =
    footerHasDatabaseSettings
      ? databaseFooterSocialLinks
      : databaseFooterSocialLinks.length > 0
        ? databaseFooterSocialLinks
        : DEFAULT_FOOTER_SOCIAL_LINKS;

  /* =======================================================
     PUBLIC WEBSITE
     ======================================================= */

  return (
    <>
      <ScrollProgress />

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
        <Hero
          content={
            heroContent
          }
        />

        <Marquee />

        <Stats
          stats={
            databaseStats
          }
        />

        <Products
          products={
            databaseProducts
          }
        />

        <Builds
          builds={
            databaseBuilds
          }
        />

        <Features
          settings={
            featuresContent
          }
          features={
            databaseFeatures
          }
        />

        <Marquee reverse />

        <Blog
          content={
            blogContent
          }
          posts={
            blogPosts
          }
        />

        <Contact
          content={
            contactContent
          }
          socialLinks={
            databaseContactSocialLinks
          }
        />
      </main>

      <Footer
        content={
          footerContent
        }
        links={
          publicFooterLinks
        }
        socialLinks={
          publicFooterSocialLinks
        }
      />
    </>
  );
}