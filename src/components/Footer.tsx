import type {
  ComponentType,
} from "react";

import {
  ArrowUp,
  Mail,
  MapPin,
  Phone,
  Zap,
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

import gamexLogo from "@/app/logo.png";

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
   DEFAULT FOOTER CONTENT
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
   DEFAULT FOOTER LINKS
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
   DEFAULT SOCIAL LINKS
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

    twitter:
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

    twitter:
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
     LOGO

     Admin logo has priority.

     If Admin logo is empty:
     use src/app/logo.png
     ======================================================= */

  const logoSrc =
    content.logoImage?.trim()
      ? content.logoImage
      : gamexLogo.src;

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

        overflow-hidden

        border-t
        border-brand/15

        bg-[#fff8f8]
      "
    >
      {/* ===================================================
          RED TOP LINE
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          absolute

          left-1/2
          top-0

          h-[2px]
          w-[80%]

          -translate-x-1/2

          bg-gradient-to-r

          from-transparent
          via-brand
          to-transparent
        "
      />

      {/* ===================================================
          BACKGROUND GRID
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          bg-grid

          pointer-events-none

          absolute
          inset-0

          opacity-20

          [mask-image:radial-gradient(ellipse_75%_80%_at_50%_45%,black,transparent)]
        "
      />

      {/* ===================================================
          LEFT RED GLOW
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute

          -left-40
          bottom-0

          h-[28rem]
          w-[28rem]

          rounded-full

          bg-brand/[0.055]

          blur-[140px]
        "
      />

      {/* ===================================================
          RIGHT RED GLOW
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute

          -right-40
          top-10

          h-[26rem]
          w-[26rem]

          rounded-full

          bg-brand-soft/[0.045]

          blur-[140px]
        "
      />

      {/* ===================================================
          MAIN FOOTER
          =================================================== */}

      <div
        className="
          relative

          mx-auto

          max-w-7xl

          px-5
          py-16

          md:px-8
          md:py-20
        "
      >
        <div
          className="
            grid

            gap-10

            lg:grid-cols-[1.3fr_0.8fr_1fr]
            lg:gap-14
          "
        >
          {/* =================================================
              BRAND COLUMN
              ================================================= */}

          <div>
            {/* ===============================================
                LOGO
                =============================================== */}

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

                relative

                inline-flex

                items-center
              "
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}

              <img
                src={
                  logoSrc
                }
                alt={
                  content.logoAlt ||
                  "Gamex"
                }
                className="
                  h-auto

                  w-[170px]

                  object-contain
                  object-left

                  transition-all
                  duration-300

                  group-hover:scale-[1.035]

                  sm:w-[190px]

                  lg:w-[210px]
                "
              />

              {/* =============================================
                  LOGO RED GLOW
                  ============================================= */}

              <span
                aria-hidden="true"
                className="
                  pointer-events-none

                  absolute

                  inset-x-[12%]
                  -bottom-3

                  h-4

                  rounded-full

                  bg-brand/15

                  opacity-0

                  blur-xl

                  transition-opacity
                  duration-300

                  group-hover:opacity-100
                "
              />
            </a>

            {/* ===============================================
                DESCRIPTION
                =============================================== */}

            <p
              className="
                mt-6

                max-w-sm

                text-sm

                font-medium

                leading-7

                text-slate-600
              "
            >
              {
                content.description
              }
            </p>

            {/* ===============================================
                BRAND STRIPE
                =============================================== */}

            <div
              aria-hidden="true"
              className="
                mt-6

                flex

                items-center

                gap-2
              "
            >
              <span
                className="
                  h-[3px]
                  w-12

                  rounded-full

                  bg-brand
                "
              />

              <span
                className="
                  h-[3px]
                  w-5

                  rounded-full

                  bg-black/70
                "
              />

              <span
                className="
                  h-[3px]
                  w-2

                  rounded-full

                  bg-brand/35
                "
              />
            </div>

            {/* ===============================================
                SOCIAL LINKS
                =============================================== */}

            {visibleSocialLinks.length >
            0 ? (
              <div
                className="
                  mt-6

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
                      social.platform
                        .trim()
                        .toLowerCase();

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
                          group/social

                          grid

                          h-10
                          w-10

                          place-items-center

                          rounded-xl

                          border
                          border-black/[0.08]

                          bg-white

                          text-brand

                          shadow-[0_8px_24px_-18px_rgba(0,0,0,0.3)]

                          transition-all

                          duration-300

                          hover:-translate-y-1

                          hover:border-brand

                          hover:bg-brand

                          hover:text-white

                          hover:shadow-[0_12px_30px_-16px_rgba(230,0,0,0.6)]
                        "
                      >
                        <Icon
                          className="
                            h-4
                            w-4

                            transition-transform

                            duration-300

                            group-hover/social:scale-110
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
            {/* ===============================================
                HEADING
                =============================================== */}

            <div
              className="
                flex

                items-center

                gap-2
              "
            >
              <span
                className="
                  h-2
                  w-2

                  rounded-full

                  bg-brand

                  shadow-[0_0_10px_rgba(230,0,0,0.4)]
                "
              />

              <h4
                className="
                  font-display

                  text-sm

                  font-extrabold

                  uppercase

                  tracking-[0.14em]

                  text-brand-deep
                "
              >
                {
                  content.navigationHeading
                }
              </h4>
            </div>

            {/* ===============================================
                NAVIGATION
                =============================================== */}

            {visibleLinks.length >
            0 ? (
              <ul
                className="
                  mt-6

                  grid

                  grid-cols-2

                  gap-x-6
                  gap-y-3

                  lg:grid-cols-1
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
                            group/link

                            inline-flex

                            items-center

                            gap-2

                            text-sm

                            font-medium

                            text-slate-600

                            transition-colors

                            duration-300

                            hover:text-brand
                          "
                        >
                          <span
                            className="
                              h-1.5
                              w-1.5

                              rounded-full

                              bg-black/15

                              transition-all

                              duration-300

                              group-hover/link:scale-125

                              group-hover/link:bg-brand
                            "
                          />

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
            {/* ===============================================
                HEADING
                =============================================== */}

            <div
              className="
                flex

                items-center

                gap-2
              "
            >
              <span
                className="
                  h-2
                  w-2

                  rounded-full

                  bg-brand

                  shadow-[0_0_10px_rgba(230,0,0,0.4)]
                "
              />

              <h4
                className="
                  font-display

                  text-sm

                  font-extrabold

                  uppercase

                  tracking-[0.14em]

                  text-brand-deep
                "
              >
                {
                  content.contactHeading
                }
              </h4>
            </div>

            {/* ===============================================
                CONTACT DETAILS
                =============================================== */}

            <div
              className="
                mt-6

                space-y-3
              "
            >
              {/* EMAIL */}

              {content.email ? (
                <a
                  href={`mailto:${content.email}`}
                  className="
                    group/contact

                    flex

                    items-start

                    gap-3

                    rounded-xl

                    border
                    border-transparent

                    p-2

                    -m-2

                    transition-all

                    duration-300

                    hover:border-brand/10

                    hover:bg-white
                  "
                >
                  <span
                    className="
                      grid

                      h-8
                      w-8

                      shrink-0

                      place-items-center

                      rounded-lg

                      bg-brand/[0.07]

                      text-brand

                      transition-all

                      group-hover/contact:bg-brand

                      group-hover/contact:text-white
                    "
                  >
                    <Mail className="h-4 w-4" />
                  </span>

                  <span
                    className="
                      pt-1

                      text-sm

                      font-medium

                      text-slate-600

                      transition-colors

                      group-hover/contact:text-brand
                    "
                  >
                    {
                      content.email
                    }
                  </span>
                </a>
              ) : null}

              {/* PHONE */}

              {content.phone ? (
                <a
                  href={`tel:${content.phone.replace(
                    /[\s()-]/g,
                    ""
                  )}`}
                  className="
                    group/contact

                    flex

                    items-start

                    gap-3

                    rounded-xl

                    border
                    border-transparent

                    p-2

                    -m-2

                    transition-all

                    duration-300

                    hover:border-brand/10

                    hover:bg-white
                  "
                >
                  <span
                    className="
                      grid

                      h-8
                      w-8

                      shrink-0

                      place-items-center

                      rounded-lg

                      bg-brand/[0.07]

                      text-brand

                      transition-all

                      group-hover/contact:bg-brand

                      group-hover/contact:text-white
                    "
                  >
                    <Phone className="h-4 w-4" />
                  </span>

                  <span
                    className="
                      pt-1

                      text-sm

                      font-medium

                      text-slate-600

                      transition-colors

                      group-hover/contact:text-brand
                    "
                  >
                    {
                      content.phone
                    }
                  </span>
                </a>
              ) : null}

              {/* ADDRESS */}

              {content.address ? (
                <div
                  className="
                    flex

                    items-start

                    gap-3
                  "
                >
                  <span
                    className="
                      grid

                      h-8
                      w-8

                      shrink-0

                      place-items-center

                      rounded-lg

                      bg-brand/[0.07]

                      text-brand
                    "
                  >
                    <MapPin className="h-4 w-4" />
                  </span>

                  <span
                    className="
                      pt-1

                      text-sm

                      font-medium

                      leading-relaxed

                      text-slate-600
                    "
                  >
                    {
                      content.address
                    }
                  </span>
                </div>
              ) : null}
            </div>

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
                  group/cta

                  relative

                  mt-7

                  inline-flex

                  items-center

                  gap-2

                  overflow-hidden

                  rounded-xl

                  bg-brand

                  px-5
                  py-3

                  font-display

                  text-xs

                  font-bold

                  uppercase

                  tracking-widest

                  text-white

                  shadow-[0_14px_35px_-18px_rgba(230,0,0,0.72)]

                  transition-all

                  duration-300

                  hover:-translate-y-0.5

                  hover:bg-[#c90000]

                  hover:shadow-[0_18px_40px_-18px_rgba(230,0,0,0.85)]
                "
              >
                {/* CTA SHINE */}

                <span
                  aria-hidden="true"
                  className="
                    absolute

                    -left-10
                    top-0

                    h-full
                    w-8

                    -skew-x-12

                    bg-white/20

                    transition-all

                    duration-700

                    group-hover/cta:left-[120%]
                  "
                />

                <Zap
                  className="
                    relative

                    h-4
                    w-4
                  "
                />

                <span className="relative">
                  {
                    content.ctaText
                  }
                </span>
              </a>
            ) : null}
          </div>
        </div>

        {/* ===================================================
            BOTTOM BAR
            =================================================== */}

        <div
          className="
            mt-14

            flex

            flex-col

            items-center

            justify-between

            gap-5

            border-t

            border-black/[0.07]

            pt-6

            sm:flex-row
          "
        >
          {/* COPYRIGHT */}

          <p
            className="
              text-center

              text-xs

              font-medium

              text-slate-500

              sm:text-left
            "
          >
            {
              copyright
            }
          </p>

          {/* ===============================================
              BACK TO TOP
              =============================================== */}

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
              group/top

              inline-flex

              items-center

              gap-2

              rounded-lg

              border
              border-black/[0.07]

              bg-white

              px-3
              py-2

              text-[10px]

              font-extrabold

              uppercase

              tracking-[0.14em]

              text-slate-600

              transition-all

              duration-300

              hover:border-brand

              hover:bg-brand

              hover:text-white

              hover:shadow-[0_10px_25px_-16px_rgba(230,0,0,0.55)]
            "
          >
            {
              content.backToTopText
            }

            <ArrowUp
              className="
                h-4
                w-4

                transition-transform

                duration-300

                group-hover/top:-translate-y-1
              "
            />
          </a>
        </div>
      </div>

      {/* ===================================================
          VERY BOTTOM RED LINE
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          absolute

          bottom-0
          left-1/2

          h-[3px]
          w-28

          -translate-x-1/2

          rounded-t-full

          bg-brand
        "
      />
    </footer>
  );
}