"use client";

import {
  useState,
  type FormEvent,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Link2,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaTwitch,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import {
  FaDiscord,
} from "react-icons/fa";

import {
  submitContact,
} from "@/app/actions";

import {
  SectionHeading,
} from "./ui";

import {
  BlurReveal,
  Parallax,
} from "./fx";

/* =========================================================
   TYPES
   ========================================================= */

type Status = {
  type:
    | "idle"
    | "loading"
    | "success"
    | "error";

  message: string;
};

/* =========================================================
   CONTACT CONTENT TYPE
   ========================================================= */

export type ContactSectionContent = {
  eyebrow: string;

  title: string;

  subtitle: string;

  emailLabel: string;

  email: string;

  phoneLabel: string;

  phone: string;

  addressLabel: string;

  address: string;

  hoursLabel: string;

  hours: string;

  socialHeading: string;

  nameLabel: string;

  namePlaceholder: string;

  formEmailLabel: string;

  formEmailPlaceholder: string;

  subjectLabel: string;

  subjectPlaceholder: string;

  messageLabel: string;

  messagePlaceholder: string;

  submitButtonText: string;

  isVisible: boolean;
};

/* =========================================================
   SOCIAL LINK TYPE
   ========================================================= */

export type PublicSocialLink = {
  id:
    | number
    | string;

  platform: string;

  url: string;
};

/* =========================================================
   DEFAULT CONTACT CONTENT
   ========================================================= */

export const DEFAULT_CONTACT_CONTENT: ContactSectionContent = {
  eyebrow:
    "Contact Us",

  title:
    "Let's build your dream rig",

  subtitle:
    "Got a build in mind or a question about components? Drop us a message — our team replies within 24 hours.",

  emailLabel:
    "Email",

  email:
    "hello@gamex.gg",

  phoneLabel:
    "Phone",

  phone:
    "0303-6009123",

  addressLabel:
    "HQ",

  address:
    "17-A Airport Road Divine Garden Lahore",

  hoursLabel:
    "Hours",

  hours:
    "24/7 — we never sleep",

  socialHeading:
    "Follow the squad",

  nameLabel:
    "Name",

  namePlaceholder:
    "Your name",

  formEmailLabel:
    "Email",

  formEmailPlaceholder:
    "you@email.com",

  subjectLabel:
    "Subject",

  subjectPlaceholder:
    "e.g. Custom PC quote for 1440p gaming",

  messageLabel:
    "Message",

  messagePlaceholder:
    "Tell us about the build you want, your budget range and any games you play...",

  submitButtonText:
    "Send Message",

  isVisible:
    true,
};

/* =========================================================
   DEFAULT SOCIAL LINKS
   ========================================================= */

const DEFAULT_SOCIAL_LINKS: PublicSocialLink[] = [
  {
    id:
      "default-x",

    platform:
      "x",

    url:
      "#contact",
  },

  {
    id:
      "default-instagram",

    platform:
      "instagram",

    url:
      "#contact",
  },

  {
    id:
      "default-youtube",

    platform:
      "youtube",

    url:
      "#contact",
  },

  {
    id:
      "default-twitch",

    platform:
      "twitch",

    url:
      "#contact",
  },
];

/* =========================================================
   INPUT STYLE
   ========================================================= */

const inputCls = `
  w-full

  rounded-xl

  border
  border-black/[0.08]

  bg-[#fffafa]

  px-4
  py-3.5

  text-sm
  font-medium

  text-brand-deep

  outline-none

  transition-all
  duration-300

  placeholder:text-slate-400

  hover:border-brand/20

  focus:border-brand/60

  focus:bg-white

  focus:shadow-[0_0_0_4px_rgba(230,0,0,0.09)]
`;

/* =========================================================
   SOCIAL ICON
   ========================================================= */

function SocialIcon({
  platform,
  className,
}: {
  platform: string;

  className?: string;
}) {
  switch (
    platform
      .trim()
      .toLowerCase()
  ) {
    case "instagram":
      return (
        <FaInstagram
          className={
            className
          }
        />
      );

    case "tiktok":
      return (
        <FaTiktok
          className={
            className
          }
        />
      );

    case "facebook":
      return (
        <FaFacebookF
          className={
            className
          }
        />
      );

    case "youtube":
      return (
        <FaYoutube
          className={
            className
          }
        />
      );

    case "x":
    case "twitter":
      return (
        <FaXTwitter
          className={
            className
          }
        />
      );

    case "twitch":
      return (
        <FaTwitch
          className={
            className
          }
        />
      );

    case "discord":
      return (
        <FaDiscord
          className={
            className
          }
        />
      );

    case "whatsapp":
      return (
        <FaWhatsapp
          className={
            className
          }
        />
      );

    case "linkedin":
      return (
        <FaLinkedinIn
          className={
            className
          }
        />
      );

    default:
      return (
        <Link2
          className={
            className
          }
        />
      );
  }
}

/* =========================================================
   SOCIAL PLATFORM LABEL
   ========================================================= */

function getSocialLabel(
  platform: string
) {
  switch (
    platform
      .trim()
      .toLowerCase()
  ) {
    case "instagram":
      return "Instagram";

    case "tiktok":
      return "TikTok";

    case "facebook":
      return "Facebook";

    case "youtube":
      return "YouTube";

    case "x":
    case "twitter":
      return "X";

    case "twitch":
      return "Twitch";

    case "discord":
      return "Discord";

    case "whatsapp":
      return "WhatsApp";

    case "linkedin":
      return "LinkedIn";

    default:
      return platform;
  }
}

/* =========================================================
   HEADING ACCENT
   ========================================================= */

function getAccentWord(
  title: string
) {
  const words =
    title
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (
    words.length ===
    0
  ) {
    return undefined;
  }

  /*
   * Preserve the original "dream"
   * highlight when present.
   */
  const dreamWord =
    words.find(
      (word) =>
        word
          .replace(
            /[^a-zA-Z0-9]/g,
            ""
          )
          .toLowerCase() ===
        "dream"
    );

  if (dreamWord) {
    return dreamWord.replace(
      /[^a-zA-Z0-9]/g,
      ""
    );
  }

  /*
   * For custom Admin headings,
   * accent the second-last word.
   */
  if (
    words.length >=
    2
  ) {
    return words[
      words.length -
        2
    ].replace(
      /[^a-zA-Z0-9]/g,
      ""
    );
  }

  return words[0].replace(
    /[^a-zA-Z0-9]/g,
    ""
  );
}

/* =========================================================
   CONTACT
   ========================================================= */

export function Contact({
  content =
    DEFAULT_CONTACT_CONTENT,

  socialLinks,
}: {
  content?: ContactSectionContent;

  socialLinks?: PublicSocialLink[];
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
     SOCIAL LINKS
     ======================================================= */

  const resolvedSocialLinks =
    socialLinks ===
    undefined
      ? DEFAULT_SOCIAL_LINKS
      : socialLinks;

  /* =======================================================
     FORM STATE
     ======================================================= */

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [
    status,
    setStatus,
  ] = useState<Status>({
    type:
      "idle",

    message:
      "",
  });

  /* =======================================================
     CONTACT INFORMATION
     ======================================================= */

  const info = [
    {
      icon:
        Mail,

      label:
        content.emailLabel,

      value:
        content.email,
    },

    {
      icon:
        Phone,

      label:
        content.phoneLabel,

      value:
        content.phone,
    },

    {
      icon:
        MapPin,

      label:
        content.addressLabel,

      value:
        content.address,
    },

    {
      icon:
        Clock,

      label:
        content.hoursLabel,

      value:
        content.hours,
    },
  ];

  /* =======================================================
     UPDATE FORM
     ======================================================= */

  function update(
    key:
      keyof typeof form,

    value: string
  ) {
    setForm(
      (
        current
      ) => ({
        ...current,

        [key]:
          value,
      })
    );
  }

  /* =======================================================
     SUBMIT
     ======================================================= */

  async function onSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setStatus({
      type:
        "loading",

      message:
        "Transmitting...",
    });

    const response =
      await submitContact(
        form
      );

    if (
      response.success
    ) {
      setStatus({
        type:
          "success",

        message:
          response.message,
      });

      setForm({
        name:
          "",

        email:
          "",

        subject:
          "",

        message:
          "",
      });

      return;
    }

    setStatus({
      type:
        "error",

      message:
        response.message,
    });
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <section
      id="contact"
      className="
        relative

        overflow-hidden

        bg-white

        py-24

        md:py-32
      "
    >
      {/* ===================================================
          TOP RED LINE
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute

          left-1/2
          top-0

          h-px
          w-[80%]

          -translate-x-1/2

          bg-gradient-to-r

          from-transparent
          via-brand/20
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
          grid-animated

          pointer-events-none

          absolute
          inset-0

          -z-10

          opacity-30

          [mask-image:radial-gradient(ellipse_65%_65%_at_50%_50%,black,transparent)]
        "
      />

      {/* ===================================================
          LEFT RED GLOW
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          animate-pulse-glow

          pointer-events-none

          absolute

          -left-40
          bottom-0

          -z-10

          h-[28rem]
          w-[28rem]

          rounded-full

          bg-brand/[0.07]

          blur-[130px]
        "
      />

      {/* ===================================================
          RIGHT RED GLOW
          =================================================== */}

      <Parallax
        speed={
          120
        }
        className="
          pointer-events-none

          absolute

          -right-32
          top-20

          -z-10

          h-[22rem]
          w-[22rem]

          rounded-full

          bg-brand-soft/[0.055]

          blur-[130px]
        "
      />

      {/* ===================================================
          RED VIGNETTE
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          red-vignette

          pointer-events-none

          absolute
          inset-0

          -z-10
        "
      />

      {/* ===================================================
          CONTENT
          =================================================== */}

      <div
        className="
          relative

          mx-auto

          max-w-7xl

          px-5

          md:px-8
        "
      >
        {/* =================================================
            SECTION HEADING
            ================================================= */}

        <SectionHeading
          eyebrow={
            content.eyebrow
          }
          title={
            content.title
          }
          accent={
            getAccentWord(
              content.title
            )
          }
          subtitle={
            content.subtitle
          }
        />

        {/* =================================================
            MAIN GRID
            ================================================= */}

        <div
          className="
            mt-14

            grid

            gap-8

            lg:grid-cols-5
          "
        >
          {/* =================================================
              LEFT
              ================================================= */}

          <div
            className="
              space-y-4

              lg:col-span-2
            "
          >
            {/* =================================================
                CONTACT INFORMATION
                ================================================= */}

            {info.map(
              (
                item,
                index
              ) => {
                const Icon =
                  item.icon;

                return (
                  <BlurReveal
                    key={
                      item.label
                    }
                    delay={
                      index *
                      0.06
                    }
                  >
                    <div
                      className="
                        group

                        relative

                        flex

                        items-center

                        gap-4

                        overflow-hidden

                        rounded-2xl

                        border
                        border-black/[0.07]

                        bg-white

                        p-5

                        shadow-[0_16px_42px_-34px_rgba(0,0,0,0.28)]

                        transition-all

                        duration-300

                        hover:-translate-y-0.5

                        hover:border-brand/25

                        hover:shadow-[0_20px_45px_-32px_rgba(230,0,0,0.28)]
                      "
                    >
                      {/* =====================================
                          LEFT RED HOVER LINE
                          ===================================== */}

                      <span
                        aria-hidden="true"
                        className="
                          absolute

                          left-0
                          top-1/2

                          h-0
                          w-[3px]

                          -translate-y-1/2

                          rounded-r-full

                          bg-brand

                          transition-all

                          duration-300

                          group-hover:h-10
                        "
                      />

                      {/* =====================================
                          ICON
                          ===================================== */}

                      <div
                        className="
                          relative
                          z-10

                          grid

                          h-12
                          w-12

                          shrink-0

                          place-items-center

                          rounded-xl

                          border
                          border-brand/15

                          bg-brand/[0.065]

                          text-brand

                          shadow-[0_10px_28px_-20px_rgba(230,0,0,0.35)]

                          transition-all

                          duration-300

                          group-hover:scale-105

                          group-hover:border-brand

                          group-hover:bg-brand

                          group-hover:text-white

                          group-hover:shadow-[0_12px_28px_-16px_rgba(230,0,0,0.6)]
                        "
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* =====================================
                          TEXT
                          ===================================== */}

                      <div
                        className="
                          relative
                          z-10

                          min-w-0
                        "
                      >
                        <p
                          className="
                            text-[10px]

                            font-extrabold

                            uppercase

                            tracking-[0.18em]

                            text-slate-500
                          "
                        >
                          {
                            item.label
                          }
                        </p>

                        <p
                          className="
                            mt-1

                            break-words

                            text-sm

                            font-bold

                            leading-relaxed

                            text-brand-deep

                            transition-colors

                            duration-300

                            group-hover:text-brand

                            sm:text-[15px]
                          "
                        >
                          {
                            item.value
                          }
                        </p>
                      </div>

                      {/* =====================================
                          GLOW
                          ===================================== */}

                      <div
                        aria-hidden="true"
                        className="
                          pointer-events-none

                          absolute

                          -right-12
                          -top-12

                          h-28
                          w-28

                          rounded-full

                          bg-brand/[0.04]

                          opacity-0

                          blur-2xl

                          transition-opacity

                          duration-300

                          group-hover:opacity-100
                        "
                      />
                    </div>
                  </BlurReveal>
                );
              }
            )}

            {/* =================================================
                SOCIAL MEDIA
                ================================================= */}

            <BlurReveal
              delay={
                0.3
              }
            >
              <div
                className="
                  relative

                  overflow-hidden

                  rounded-2xl

                  border
                  border-brand/15

                  bg-[#fff8f8]

                  p-5
                "
              >
                {/* ===========================================
                    DECORATION
                    =========================================== */}

                <div
                  aria-hidden="true"
                  className="
                    absolute

                    -right-12
                    -top-12

                    h-28
                    w-28

                    rounded-full

                    bg-brand/[0.06]

                    blur-2xl
                  "
                />

                {/* ===========================================
                    HEADING
                    =========================================== */}

                <p
                  className="
                    relative

                    flex

                    items-center

                    gap-2

                    font-display

                    text-sm

                    font-bold

                    uppercase

                    tracking-wider

                    text-brand-deep
                  "
                >
                  <span
                    className="
                      grid

                      h-8
                      w-8

                      place-items-center

                      rounded-lg

                      bg-brand

                      text-white
                    "
                  >
                    <MessageSquare className="h-4 w-4" />
                  </span>

                  {
                    content.socialHeading
                  }
                </p>

                {/* ===========================================
                    SOCIAL BUTTONS
                    =========================================== */}

                {resolvedSocialLinks.length >
                0 ? (
                  <div
                    className="
                      relative

                      mt-5

                      flex

                      flex-wrap

                      gap-3
                    "
                  >
                    {resolvedSocialLinks.map(
                      (
                        social
                      ) => {
                        const external =
                          social.url.startsWith(
                            "http://"
                          ) ||
                          social.url.startsWith(
                            "https://"
                          );

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
                              getSocialLabel(
                                social.platform
                              )
                            }
                            title={
                              getSocialLabel(
                                social.platform
                              )
                            }
                            className="
                              group/social

                              grid

                              h-11
                              w-11

                              place-items-center

                              rounded-xl

                              border
                              border-black/[0.08]

                              bg-white

                              text-brand

                              shadow-[0_8px_22px_-18px_rgba(0,0,0,0.3)]

                              transition-all

                              duration-300

                              hover:-translate-y-1

                              hover:border-brand

                              hover:bg-brand

                              hover:text-white

                              hover:shadow-[0_12px_28px_-16px_rgba(230,0,0,0.6)]
                            "
                          >
                            <SocialIcon
                              platform={
                                social.platform
                              }
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
                ) : (
                  <p
                    className="
                      relative

                      mt-4

                      text-sm

                      leading-relaxed

                      text-slate-500
                    "
                  >
                    Follow us for the latest Gamex updates.
                  </p>
                )}

                {/* ===========================================
                    BOTTOM RED LINE
                    =========================================== */}

                <div
                  aria-hidden="true"
                  className="
                    absolute

                    bottom-0
                    left-0

                    h-[3px]
                    w-16

                    bg-brand
                  "
                />
              </div>
            </BlurReveal>
          </div>

          {/* =================================================
              RIGHT — CONTACT FORM
              ================================================= */}

          <BlurReveal
            delay={
              0.1
            }
            className="
              lg:col-span-3
            "
          >
            <form
              onSubmit={
                onSubmit
              }
              className="
                relative

                overflow-hidden

                rounded-3xl

                border
                border-black/[0.07]

                bg-white

                p-6

                shadow-[0_30px_80px_-42px_rgba(0,0,0,0.28)]

                md:p-8
              "
            >
              {/* =============================================
                  RED TOP LINE
                  ============================================= */}

              <div
                aria-hidden="true"
                className="
                  absolute

                  inset-x-0
                  top-0

                  h-[3px]

                  bg-gradient-to-r

                  from-transparent
                  via-brand
                  to-transparent
                "
              />

              {/* =============================================
                  FORM BACKGROUND GLOW
                  ============================================= */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none

                  absolute

                  -right-24
                  -top-24

                  h-64
                  w-64

                  rounded-full

                  bg-brand/[0.045]

                  blur-[80px]
                "
              />

              {/* =============================================
                  FORM HEADER
                  ============================================= */}

              <div
                className="
                  relative

                  mb-7

                  border-b
                  border-black/[0.06]

                  pb-5
                "
              >
                <div
                  className="
                    flex

                    items-center

                    gap-3
                  "
                >
                  <div
                    className="
                      grid

                      h-10
                      w-10

                      place-items-center

                      rounded-xl

                      bg-brand

                      text-white

                      shadow-[0_10px_25px_-14px_rgba(230,0,0,0.65)]
                    "
                  >
                    <Send className="h-4 w-4" />
                  </div>

                  <div>
                    <p
                      className="
                        font-display

                        text-sm

                        font-extrabold

                        uppercase

                        tracking-wider

                        text-brand-deep
                      "
                    >
                      Send us a message
                    </p>

                    <p
                      className="
                        mt-1

                        text-xs

                        text-slate-500
                      "
                    >
                      Tell us what you need and our team will get back to you.
                    </p>
                  </div>
                </div>
              </div>

              {/* =============================================
                  NAME + EMAIL
                  ============================================= */}

              <div
                className="
                  relative

                  grid

                  gap-5

                  sm:grid-cols-2
                "
              >
                {/* NAME */}

                <div>
                  <label
                    htmlFor="name"
                    className="
                      mb-2

                      block

                      text-[10px]

                      font-extrabold

                      uppercase

                      tracking-[0.16em]

                      text-brand-deep
                    "
                  >
                    {
                      content.nameLabel
                    }

                    <span className="ml-1 text-brand">
                      *
                    </span>
                  </label>

                  <input
                    id="name"
                    value={
                      form.name
                    }
                    onChange={(
                      event
                    ) =>
                      update(
                        "name",
                        event
                          .target
                          .value
                      )
                    }
                    placeholder={
                      content.namePlaceholder
                    }
                    className={
                      inputCls
                    }
                    required
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="
                      mb-2

                      block

                      text-[10px]

                      font-extrabold

                      uppercase

                      tracking-[0.16em]

                      text-brand-deep
                    "
                  >
                    {
                      content.formEmailLabel
                    }

                    <span className="ml-1 text-brand">
                      *
                    </span>
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={
                      form.email
                    }
                    onChange={(
                      event
                    ) =>
                      update(
                        "email",
                        event
                          .target
                          .value
                      )
                    }
                    placeholder={
                      content.formEmailPlaceholder
                    }
                    className={
                      inputCls
                    }
                    required
                  />
                </div>
              </div>

              {/* =============================================
                  SUBJECT
                  ============================================= */}

              <div
                className="
                  relative

                  mt-5
                "
              >
                <label
                  htmlFor="subject"
                  className="
                    mb-2

                    block

                    text-[10px]

                    font-extrabold

                    uppercase

                    tracking-[0.16em]

                    text-brand-deep
                  "
                >
                  {
                    content.subjectLabel
                  }

                  <span className="ml-1 text-brand">
                    *
                  </span>
                </label>

                <input
                  id="subject"
                  value={
                    form.subject
                  }
                  onChange={(
                    event
                  ) =>
                    update(
                      "subject",
                      event
                        .target
                        .value
                    )
                  }
                  placeholder={
                    content.subjectPlaceholder
                  }
                  className={
                    inputCls
                  }
                  required
                />
              </div>

              {/* =============================================
                  MESSAGE
                  ============================================= */}

              <div
                className="
                  relative

                  mt-5
                "
              >
                <label
                  htmlFor="message"
                  className="
                    mb-2

                    block

                    text-[10px]

                    font-extrabold

                    uppercase

                    tracking-[0.16em]

                    text-brand-deep
                  "
                >
                  {
                    content.messageLabel
                  }

                  <span className="ml-1 text-brand">
                    *
                  </span>
                </label>

                <textarea
                  id="message"
                  value={
                    form.message
                  }
                  onChange={(
                    event
                  ) =>
                    update(
                      "message",
                      event
                        .target
                        .value
                    )
                  }
                  placeholder={
                    content.messagePlaceholder
                  }
                  rows={
                    5
                  }
                  className={`
                    ${inputCls}

                    resize-none
                  `}
                  required
                />
              </div>

              {/* =============================================
                  SUBMIT AREA
                  ============================================= */}

              <div
                className="
                  relative

                  mt-6

                  flex

                  flex-col

                  gap-4

                  sm:flex-row
                  sm:items-center
                "
              >
                <button
                  type="submit"
                  disabled={
                    status.type ===
                    "loading"
                  }
                  className="
                    group

                    relative

                    inline-flex

                    w-full

                    items-center

                    justify-center

                    gap-2.5

                    overflow-hidden

                    rounded-xl

                    bg-brand

                    px-7
                    py-4

                    font-display

                    text-xs

                    font-bold

                    uppercase

                    tracking-[0.15em]

                    text-white

                    shadow-[0_15px_38px_-18px_rgba(230,0,0,0.72)]

                    transition-all

                    duration-300

                    hover:-translate-y-0.5

                    hover:bg-[#c90000]

                    hover:shadow-[0_20px_44px_-18px_rgba(230,0,0,0.85)]

                    focus:outline-none

                    focus:ring-4

                    focus:ring-brand/15

                    disabled:cursor-not-allowed

                    disabled:opacity-65

                    disabled:hover:translate-y-0

                    sm:w-auto
                  "
                >
                  {/* =========================================
                      BUTTON SHINE
                      ========================================= */}

                  <span
                    aria-hidden="true"
                    className="
                      absolute

                      -left-12
                      top-0

                      h-full
                      w-10

                      -skew-x-12

                      bg-white/20

                      transition-all

                      duration-700

                      group-hover:left-[120%]
                    "
                  />

                  {status.type ===
                  "loading" ? (
                    <>
                      <Loader2
                        className="
                          relative

                          h-4
                          w-4

                          animate-spin
                        "
                      />

                      <span className="relative">
                        Sending...
                      </span>
                    </>
                  ) : (
                    <>
                      <Send
                        className="
                          relative

                          h-4
                          w-4

                          transition-transform

                          duration-300

                          group-hover:translate-x-0.5
                          group-hover:-translate-y-0.5
                        "
                      />

                      <span className="relative">
                        {
                          content.submitButtonText
                        }
                      </span>
                    </>
                  )}
                </button>

                <p
                  className="
                    text-xs

                    leading-relaxed

                    text-slate-400
                  "
                >
                  We normally reply within 24 hours.
                </p>
              </div>

              {/* =============================================
                  SUCCESS / ERROR MESSAGE
                  ============================================= */}

              <AnimatePresence>
                {status.type ===
                  "success" ||
                status.type ===
                  "error" ? (
                  <motion.div
                    initial={{
                      opacity:
                        0,

                      y:
                        10,
                    }}
                    animate={{
                      opacity:
                        1,

                      y:
                        0,
                    }}
                    exit={{
                      opacity:
                        0,

                      y:
                        -6,
                    }}
                    transition={{
                      duration:
                        0.25,
                    }}
                    className={`
                      relative

                      mt-5

                      flex

                      items-start

                      gap-3

                      rounded-xl

                      border

                      px-4
                      py-3.5

                      text-sm

                      font-semibold

                      ${
                        status.type ===
                        "success"
                          ? `
                            border-emerald-500/25
                            bg-emerald-50
                            text-emerald-700
                          `
                          : `
                            border-brand/25
                            bg-brand/[0.06]
                            text-brand
                          `
                      }
                    `}
                  >
                    {status.type ===
                    "success" ? (
                      <CheckCircle2
                        className="
                          mt-0.5

                          h-5
                          w-5

                          shrink-0
                        "
                      />
                    ) : (
                      <AlertTriangle
                        className="
                          mt-0.5

                          h-5
                          w-5

                          shrink-0
                        "
                      />
                    )}

                    <span
                      className="
                        leading-relaxed
                      "
                    >
                      {
                        status.message
                      }
                    </span>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </form>
          </BlurReveal>
        </div>
      </div>

      {/* ===================================================
          BOTTOM RED DIVIDER
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute

          bottom-0
          left-1/2

          h-px
          w-[80%]

          -translate-x-1/2

          bg-gradient-to-r

          from-transparent
          via-brand/15
          to-transparent
        "
      />
    </section>
  );
}