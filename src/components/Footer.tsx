import type {
  ComponentType,
} from "react";

import {
  ArrowUp,
  Gamepad2,
} from "lucide-react";

import {
  FaDiscord,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaTwitch,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

/* =========================================================
   TYPES
   ========================================================= */

export type FooterContent = {
  brandText: string;
  brandHref: string;

  logoImage: string;
  logoAlt: string;

  description: string;

  navigationHeading: string;
  contactHeading: string;

  email: string;
  phone: string;
  address: string;

  ctaText: string;
  ctaHref: string;
  ctaVisible: boolean;

  copyrightText: string;

  backToTopText: string;
  backToTopHref: string;

  isVisible: boolean;
};

export type PublicFooterLink = {
  id:
    | number
    | string;

  label: string;
  href: string;
};

export type PublicFooterSocialLink = {
  id:
    | number
    | string;

  platform: string;
  url: string;
};

/* =========================================================
   ORIGINAL FOOTER CONTENT
   ========================================================= */

export const DEFAULT_FOOTER_CONTENT: FooterContent = {
  brandText:
    "GAMEX",

  brandHref:
    "#home",

  logoImage:
    "",

  logoAlt:
    "Gamex",

  description:
    "Premium gaming hardware for players who refuse to lose. Custom PCs, GPUs, RAM, processors and pro accessories — built to win.",

  navigationHeading:
    "Navigate",

  contactHeading:
    "Get in touch",

  email:
    "hello@gamex.gg",

  phone:
    "0303-6009123",

  address:
    "17-A Divine Garden Lahore",

  ctaText:
    "Start Your Build",

  ctaHref:
    "#contact",

  ctaVisible:
    true,

  copyrightText:
    "© {year} Gamex. All rights reserved. Play hard.",

  backToTopText:
    "Back to top",

  backToTopHref:
    "#home",

  isVisible:
    true,
};

/* =========================================================
   ORIGINAL FOOTER LINKS
   ========================================================= */

export const DEFAULT_FOOTER_LINKS: PublicFooterLink[] = [
  {
    id:
      "default-footer-home",

    label:
      "Home",

    href:
      "#home",
  },

  {
    id:
      "default-footer-products",

    label:
      "Products",

    href:
      "#products",
  },

  {
    id:
      "default-footer-builds",

    label:
      "Custom Builds",

    href:
      "#builds",
  },

  {
    id:
      "default-footer-features",

    label:
      "Why Gamex",

    href:
      "#features",
  },

  {
    id:
      "default-footer-blog",

    label:
      "Blog",

    href:
      "#blog",
  },

  {
    id:
      "default-footer-contact",

    label:
      "Contact",

    href:
      "#contact",
  },
];

/* =========================================================
   ORIGINAL SOCIAL LINKS
   ========================================================= */

export const DEFAULT_FOOTER_SOCIAL_LINKS: PublicFooterSocialLink[] =
  [
    {
      id:
        "default-footer-x",

      platform:
        "x",

      url:
        "#home",
    },

    {
      id:
        "default-footer-instagram",

      platform:
        "instagram",

      url:
        "#home",
    },

    {
      id:
        "default-footer-youtube",

      platform:
        "youtube",

      url:
        "#home",
    },

    {
      id:
        "default-footer-twitch",

      platform:
        "twitch",

      url:
        "#home",
    },
  ];

/* =========================================================
   SOCIAL ICONS
   ========================================================= */

type SocialIconComponent =
  ComponentType<{
    className?: string;
  }>;

const SOCIAL_ICONS:
  Record<
    string,
    SocialIconComponent
  > = {
    instagram:
      FaInstagram,

    tiktok:
      FaTiktok,

    facebook:
      FaFacebookF,

    youtube:
      FaYoutube,

    x:
      FaXTwitter,

    twitch:
      FaTwitch,

    discord:
      FaDiscord,

    whatsapp:
      FaWhatsapp,

    linkedin:
      FaLinkedinIn,
  };

/* =========================================================
   SOCIAL LABELS
   ========================================================= */

const SOCIAL_LABELS:
  Record<
    string,
    string
  > = {
    instagram:
      "Instagram",

    tiktok:
      "TikTok",

    facebook:
      "Facebook",

    youtube:
      "YouTube",

    x:
      "X",

    twitch:
      "Twitch",

    discord:
      "Discord",

    whatsapp:
      "WhatsApp",

    linkedin:
      "LinkedIn",
  };

/* =========================================================
   EXTERNAL LINK CHECK
   ========================================================= */

function isExternalLink(
  href: string
) {
  return (
    href.startsWith(
      "https://"
    ) ||
    href.startsWith(
      "http://"
    )
  );
}

/* =========================================================
   BRAND TEXT FALLBACK
   ========================================================= */

function BrandText({
  text,
}: {
  text: string;
}) {
  if (!text) {
    return null;
  }

  if (
    text.length === 1
  ) {
    return (
      <span className="text-brand">
        {text}
      </span>
    );
  }

  const normalText =
    text.slice(
      0,
      -1
    );

  const accentCharacter =
    text.slice(
      -1
    );

  return (
    <>
      {normalText}

      <span className="text-brand">
        {accentCharacter}
      </span>
    </>
  );
}

/* =========================================================
   FOOTER
   ========================================================= */

export function Footer({
  content =
    DEFAULT_FOOTER_CONTENT,

  links,

  socialLinks,
}: {
  content?: FooterContent;

  links?: PublicFooterLink[];

  socialLinks?: PublicFooterSocialLink[];
}) {
  /* =======================================================
     VISIBILITY
     ======================================================= */

  if (
    !content.isVisible
  ) {
    return null;
  }

  /* =======================================================
     LINK SOURCES
     ======================================================= */

  const visibleLinks =
    links === undefined
      ? DEFAULT_FOOTER_LINKS
      : links;

  const visibleSocialLinks =
    socialLinks === undefined
      ? DEFAULT_FOOTER_SOCIAL_LINKS
      : socialLinks;

  /* =======================================================
     COPYRIGHT YEAR
     ======================================================= */

  const currentYear =
    new Date().getFullYear();

  const copyright =
    content.copyrightText.replaceAll(
      "{year}",
      String(
        currentYear
      )
    );

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <footer
      className="
        relative
        border-t
        border-brand/10
        bg-[#f7f9fc]
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
          px-5
          py-14
          md:px-8
        "
      >
        <div
          className="
            grid
            gap-10
            md:grid-cols-3
          "
        >
          {/* =================================================
              BRAND COLUMN
              ================================================= */}

          <div>
            <a
              href={
                content.brandHref
              }
              target={
                isExternalLink(
                  content.brandHref
                )
                  ? "_blank"
                  : undefined
              }
              rel={
                isExternalLink(
                  content.brandHref
                )
                  ? "noopener noreferrer"
                  : undefined
              }
              aria-label={
                content.logoAlt ||
                content.brandText ||
                "Gamex"
              }
              className="
                group
                inline-flex
                items-center
              "
            >
              {/* ===============================================
                  CUSTOM HORIZONTAL LOGO
                  =============================================== */}

              {content.logoImage ? (
                // Admin-controlled logo URL.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={
                    content.logoImage
                  }
                  alt={
                    content.logoAlt ||
                    "Gamex"
                  }
                  className="
                    h-auto
                    w-[150px]
                    object-contain
                    object-left
                    transition-transform
                    duration-300
                    group-hover:scale-[1.03]

                    sm:w-[165px]

                    md:w-[175px]

                    lg:w-[190px]
                  "
                />
              ) : (
                /* =============================================
                   FALLBACK OLD BRAND
                   ============================================= */

                <div
                  className="
                    flex
                    items-center
                    gap-2.5
                  "
                >
                  <span
                    className="
                      grid
                      h-9
                      w-9
                      shrink-0
                      place-items-center
                      rounded-lg
                      bg-brand
                      text-white
                      shadow-[0_0_22px_rgba(23,49,96,0.28)]
                    "
                  >
                    <Gamepad2
                      className="
                        h-5
                        w-5
                      "
                    />
                  </span>

                  <span
                    className="
                      font-display
                      text-xl
                      font-extrabold
                      tracking-widest
                      text-brand-deep
                    "
                  >
                    <BrandText
                      text={
                        content.brandText
                      }
                    />
                  </span>
                </div>
              )}
            </a>

            {/* ===============================================
                DESCRIPTION
                =============================================== */}

            <p
              className="
                mt-5
                max-w-xs
                text-sm
                leading-relaxed
                text-slate-500
              "
            >
              {
                content.description
              }
            </p>

            {/* ===============================================
                SOCIAL LINKS
                =============================================== */}

            {visibleSocialLinks.length >
            0 ? (
              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  gap-3
                "
              >
                {visibleSocialLinks.map(
                  (
                    social
                  ) => {
                    const platform =
                      social.platform.toLowerCase();

                    const Icon =
                      SOCIAL_ICONS[
                        platform
                      ];

                    if (
                      !Icon
                    ) {
                      return null;
                    }

                    const external =
                      isExternalLink(
                        social.url
                      );

                    const label =
                      SOCIAL_LABELS[
                        platform
                      ] ??
                      social.platform;

                    return (
                      <a
                        key={
                          social.id
                        }
                        href={
                          social.url
                        }
                        target={
                          external
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          external
                            ? "noopener noreferrer"
                            : undefined
                        }
                        aria-label={
                          label
                        }
                        title={
                          label
                        }
                        className="
                          grid
                          h-9
                          w-9
                          place-items-center
                          rounded-lg
                          border
                          border-brand/15
                          text-slate-600
                          transition-all
                          duration-300
                          hover:border-brand/50
                          hover:bg-brand
                          hover:text-white
                        "
                      >
                        <Icon
                          className="
                            h-4
                            w-4
                          "
                        />
                      </a>
                    );
                  }
                )}
              </div>
            ) : null}
          </div>

          {/* =================================================
              NAVIGATION COLUMN
              ================================================= */}

          <div>
            <h4
              className="
                font-display
                text-sm
                font-bold
                uppercase
                tracking-widest
                text-brand-deep
              "
            >
              {
                content.navigationHeading
              }
            </h4>

            {visibleLinks.length >
            0 ? (
              <ul
                className="
                  mt-4
                  grid
                  grid-cols-2
                  gap-2
                "
              >
                {visibleLinks.map(
                  (
                    link
                  ) => {
                    const external =
                      isExternalLink(
                        link.href
                      );

                    return (
                      <li
                        key={
                          link.id
                        }
                      >
                        <a
                          href={
                            link.href
                          }
                          target={
                            external
                              ? "_blank"
                              : undefined
                          }
                          rel={
                            external
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="
                            text-sm
                            text-slate-500
                            transition-colors
                            hover:text-brand
                          "
                        >
                          {
                            link.label
                          }
                        </a>
                      </li>
                    );
                  }
                )}
              </ul>
            ) : null}
          </div>

          {/* =================================================
              CONTACT COLUMN
              ================================================= */}

          <div>
            <h4
              className="
                font-display
                text-sm
                font-bold
                uppercase
                tracking-widest
                text-brand-deep
              "
            >
              {
                content.contactHeading
              }
            </h4>

            <ul
              className="
                mt-4
                space-y-2
                text-sm
                text-slate-500
              "
            >
              {/* EMAIL */}

              {content.email ? (
                <li>
                  <a
                    href={`mailto:${content.email}`}
                    className="
                      transition-colors
                      hover:text-brand
                    "
                  >
                    {
                      content.email
                    }
                  </a>
                </li>
              ) : null}

              {/* PHONE */}

              {content.phone ? (
                <li>
                  <a
                    href={`tel:${content.phone.replace(
                      /[\s()-]/g,
                      ""
                    )}`}
                    className="
                      transition-colors
                      hover:text-brand
                    "
                  >
                    {
                      content.phone
                    }
                  </a>
                </li>
              ) : null}

              {/* ADDRESS */}

              {content.address ? (
                <li>
                  {
                    content.address
                  }
                </li>
              ) : null}
            </ul>

            {/* ===============================================
                CTA
                =============================================== */}

            {content.ctaVisible ? (
              <a
                href={
                  content.ctaHref
                }
                target={
                  isExternalLink(
                    content.ctaHref
                  )
                    ? "_blank"
                    : undefined
                }
                rel={
                  isExternalLink(
                    content.ctaHref
                  )
                    ? "noopener noreferrer"
                    : undefined
                }
                className="
                  cta-pulse
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-brand
                  px-5
                  py-2.5
                  font-display
                  text-xs
                  font-bold
                  uppercase
                  tracking-widest
                  text-white
                  transition-all
                  duration-300
                  hover:bg-brand-soft
                "
              >
                {
                  content.ctaText
                }
              </a>
            ) : null}
          </div>
        </div>

        {/* ===================================================
            BOTTOM BAR
            =================================================== */}

        <div
          className="
            mt-12
            flex
            flex-col
            items-center
            justify-between
            gap-4
            border-t
            border-brand/15
            pt-6
            sm:flex-row
          "
        >
          {/* COPYRIGHT */}

          <p
            className="
              text-center
              text-sm
              text-slate-500
              sm:text-left
            "
          >
            {
              copyright
            }
          </p>

          {/* BACK TO TOP */}

          <a
            href={
              content.backToTopHref
            }
            target={
              isExternalLink(
                content.backToTopHref
              )
                ? "_blank"
                : undefined
            }
            rel={
              isExternalLink(
                content.backToTopHref
              )
                ? "noopener noreferrer"
                : undefined
            }
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              uppercase
              tracking-wider
              text-slate-500
              transition-colors
              hover:text-brand
            "
          >
            {
              content.backToTopText
            }

            <ArrowUp
              className="
                h-4
                w-4
              "
            />
          </a>
        </div>
      </div>
    </footer>
  );
}