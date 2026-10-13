import { cache } from "react";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  navbarSettings,
  navbarLinks,
  footerSettings,
  footerLinks,
  footerSocialLinks,
} from "@/db/schema";
import { DEFAULT_NAVBAR_SETTINGS, DEFAULT_NAVBAR_LINKS } from "@/components/Navbar";
import {
  DEFAULT_FOOTER_CONTENT,
  DEFAULT_FOOTER_LINKS,
  DEFAULT_FOOTER_SOCIAL_LINKS,
} from "@/components/Footer";
function pageHref(href: string) {
  return href.startsWith("#") ? `/${href}` : href;
}
export const getSiteChrome = cache(async () => {
  const [navRows, navLinks, footerRows, links, socials] = await Promise.all([
    db.select()
      .from(navbarSettings)
      .where(eq(navbarSettings.id, "main"))
      .limit(1),
    db.select({
      id: navbarLinks.id,
      label: navbarLinks.label,
      href: navbarLinks.href,
    })
      .from(navbarLinks)
      .where(eq(navbarLinks.isVisible, true))
      .orderBy(asc(navbarLinks.sortOrder), asc(navbarLinks.id)),
    db.select()
      .from(footerSettings)
      .where(eq(footerSettings.id, "main"))
      .limit(1),
    db.select({
      id: footerLinks.id,
      label: footerLinks.label,
      href: footerLinks.href,
    })
      .from(footerLinks)
      .where(eq(footerLinks.isVisible, true))
      .orderBy(asc(footerLinks.sortOrder), asc(footerLinks.id)),
    db.select({
      id: footerSocialLinks.id,
      platform: footerSocialLinks.platform,
      url: footerSocialLinks.url,
    })
      .from(footerSocialLinks)
      .where(eq(footerSocialLinks.isVisible, true))
      .orderBy(asc(footerSocialLinks.sortOrder), asc(footerSocialLinks.id)),
  ]);
  const nav = navRows[0] ?? DEFAULT_NAVBAR_SETTINGS;
  const footer = footerRows[0] ?? DEFAULT_FOOTER_CONTENT;
  return {
    navbar: {
      ...nav,
      brandHref: pageHref(nav.brandHref),
      ctaHref: pageHref(nav.ctaHref),
    },
    navLinks: (navRows[0] || navLinks.length ? navLinks : DEFAULT_NAVBAR_LINKS)
      .map((link) => ({ ...link, href: pageHref(link.href) })),
    footer: {
      ...footer,
      brandHref: pageHref(footer.brandHref),
      ctaHref: pageHref(footer.ctaHref),
      backToTopHref: "#page-top",
    },
    footerLinks: (footerRows[0] || links.length ? links : DEFAULT_FOOTER_LINKS)
      .map((link) => ({ ...link, href: pageHref(link.href) })),
    footerSocialLinks: footerRows[0] || socials.length ? socials : DEFAULT_FOOTER_SOCIAL_LINKS,
  };
});