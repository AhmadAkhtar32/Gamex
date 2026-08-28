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

import { submitContact } from "@/app/actions";

import { SectionHeading } from "./ui";

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
   ORIGINAL CONTACT CONTENT

   This preserves the original website before the database
   connection is added to page.tsx.
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
   TEMPORARY ORIGINAL SOCIAL LINKS

   These are used ONLY while the homepage has not yet started
   passing database social links.

   Once page.tsx passes socialLinks, including an empty array,
   the database becomes the source of truth.
   ========================================================= */

const DEFAULT_SOCIAL_LINKS: PublicSocialLink[] = [
  {
    id: "default-x",
    platform: "x",
    url: "#contact",
  },

  {
    id: "default-instagram",
    platform: "instagram",
    url: "#contact",
  },

  {
    id: "default-youtube",
    platform: "youtube",
    url: "#contact",
  },

  {
    id: "default-twitch",
    platform: "twitch",
    url: "#contact",
  },
];

/* =========================================================
   INPUT STYLE
   ========================================================= */

const inputCls =
  "w-full rounded-xl border border-brand/25 bg-slate-50/80 px-4 py-3.5 text-brand-deep placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-brand/70 focus:shadow-[0_0_0_3px_rgba(23,49,96,0.12)]";

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
          className={className}
        />
      );

    case "tiktok":
      return (
        <FaTiktok
          className={className}
        />
      );

    case "facebook":
      return (
        <FaFacebookF
          className={className}
        />
      );

    case "youtube":
      return (
        <FaYoutube
          className={className}
        />
      );

    case "x":
    case "twitter":
      return (
        <FaXTwitter
          className={className}
        />
      );

    case "twitch":
      return (
        <FaTwitch
          className={className}
        />
      );

    case "discord":
      return (
        <FaDiscord
          className={className}
        />
      );

    case "whatsapp":
      return (
        <FaWhatsapp
          className={className}
        />
      );

    case "linkedin":
      return (
        <FaLinkedinIn
          className={className}
        />
      );

    default:
      return (
        <Link2
          className={className}
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

   The original heading highlighted "dream".

   We preserve that behavior for the original title. For custom
   titles, the second-last word becomes the accent.
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
    words.length === 0
  ) {
    return undefined;
  }

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

  if (
    words.length >= 2
  ) {
    return words[
      words.length - 2
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
  content = DEFAULT_CONTACT_CONTENT,
  socialLinks,
}: {
  content?: ContactSectionContent;

  socialLinks?: PublicSocialLink[];
}) {
  /* =======================================================
     SECTION VISIBILITY
     ======================================================= */

  if (
    !content.isVisible
  ) {
    return null;
  }

  /* =======================================================
     SOCIAL LINKS

     undefined:
     homepage has not yet been connected → old icons

     []:
     database is connected but contains no visible links
     ======================================================= */

  const resolvedSocialLinks =
    socialLinks === undefined
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
    type: "idle",
    message: "",
  });

  /* =======================================================
     CONTACT INFO
     ======================================================= */

  const info = [
    {
      icon: Mail,

      label:
        content.emailLabel,

      value:
        content.email,
    },

    {
      icon: Phone,

      label:
        content.phoneLabel,

      value:
        content.phone,
    },

    {
      icon: MapPin,

      label:
        content.addressLabel,

      value:
        content.address,
    },

    {
      icon: Clock,

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
      (current) => ({
        ...current,

        [key]:
          value,
      })
    );
  }

  /* =======================================================
     SUBMIT CONTACT MESSAGE

     Existing submitContact behavior is unchanged.
     ======================================================= */

  async function onSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setStatus({
      type: "loading",
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
        type: "success",
        message:
          response.message,
      });

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      return;
    }

    setStatus({
      type: "error",
      message:
        response.message,
    });
  }

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <section
      id="contact"
      className="
        relative
        overflow-hidden
        bg-white/75
        py-24
        md:py-32
      "
    >
      {/* BACKGROUND */}

      <div
        className="
          bg-grid
          grid-animated
          absolute
          inset-0
          -z-10
          opacity-40
          [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]
        "
      />

      <div
        className="
          animate-pulse-glow
          absolute
          -left-40
          bottom-0
          -z-10
          h-[28rem]
          w-[28rem]
          rounded-full
          bg-brand/15
          blur-[130px]
        "
      />

      <Parallax
        speed={120}
        className="
          pointer-events-none
          absolute
          -right-32
          top-20
          -z-10
          h-[22rem]
          w-[22rem]
          rounded-full
          bg-brand/10
          blur-[130px]
        "
      />

      <div
        className="
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

        <div
          className="
            mt-14
            grid
            gap-8
            lg:grid-cols-5
          "
        >
          {/* =================================================
              LEFT: CONTACT INFORMATION
              ================================================= */}

          <div
            className="
              space-y-4
              lg:col-span-2
            "
          >
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
                        flex
                        items-center
                        gap-4
                        rounded-2xl
                        border
                        border-brand/15
                        bg-white
                        p-5
                        shadow-[0_14px_40px_-32px_rgba(23,49,96,0.35)]
                        transition-colors
                        duration-300
                        hover:border-brand/40
                      "
                    >
                      <div
                        className="
                          grid
                          h-12
                          w-12
                          shrink-0
                          place-items-center
                          rounded-xl
                          border
                          border-brand/30
                          bg-brand/10
                          text-brand
                          transition-all
                          duration-300
                          group-hover:scale-110
                          group-hover:bg-brand
                          group-hover:text-white
                        "
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <p
                          className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-widest
                            text-slate-500
                          "
                        >
                          {item.label}
                        </p>

                        <p
                          className="
                            font-semibold
                            text-brand-deep
                          "
                        >
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </BlurReveal>
                );
              }
            )}

            {/* =================================================
                SOCIAL MEDIA
                ================================================= */}

            <BlurReveal delay={0.3}>
              <div
                className="
                  rounded-2xl
                  border
                  border-brand/20
                  bg-brand/5
                  p-5
                "
              >
                <p
                  className="
                    flex
                    items-center
                    gap-2
                    font-display
                    text-sm
                    font-bold
                    uppercase
                    tracking-wider
                    text-brand
                  "
                >
                  <MessageSquare className="h-4 w-4" />

                  {content.socialHeading}
                </p>

                {resolvedSocialLinks.length >
                0 ? (
                  <div
                    className="
                      mt-4
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
                              grid
                              h-10
                              w-10
                              place-items-center
                              rounded-lg
                              border
                              border-brand/15
                              bg-white
                              text-brand
                              transition-all
                              duration-300
                              hover:-translate-y-0.5
                              hover:border-brand/50
                              hover:bg-brand
                              hover:text-white
                            "
                          >
                            <SocialIcon
                              platform={
                                social.platform
                              }
                              className="h-4 w-4"
                            />
                          </a>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <p
                    className="
                      mt-3
                      text-xs
                      text-slate-500
                    "
                  >
                    Follow us for the latest Gamex updates.
                  </p>
                )}
              </div>
            </BlurReveal>
          </div>

          {/* =================================================
              RIGHT: CONTACT FORM
              ================================================= */}

          <BlurReveal
            delay={0.1}
            className="lg:col-span-3"
          >
            <form
              onSubmit={
                onSubmit
              }
              className="
                rounded-3xl
                border
                border-brand/15
                bg-white
                p-6
                shadow-[0_30px_80px_-40px_rgba(23,49,96,0.20)]
                md:p-8
              "
            >
              {/* =============================================
                  NAME + EMAIL
                  ============================================= */}

              <div
                className="
                  grid
                  gap-4
                  sm:grid-cols-2
                "
              >
                <div>
                  <label
                    htmlFor="name"
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-600
                    "
                  >
                    {content.nameLabel}
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

                <div>
                  <label
                    htmlFor="email"
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-600
                    "
                  >
                    {
                      content.formEmailLabel
                    }
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

              <div className="mt-4">
                <label
                  htmlFor="subject"
                  className="
                    mb-1.5
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-600
                  "
                >
                  {
                    content.subjectLabel
                  }
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

              <div className="mt-4">
                <label
                  htmlFor="message"
                  className="
                    mb-1.5
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-600
                  "
                >
                  {
                    content.messageLabel
                  }
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
                  rows={5}
                  className={`${inputCls} resize-none`}
                  required
                />
              </div>

              {/* =============================================
                  SUBMIT
                  ============================================= */}

              <button
                type="submit"
                disabled={
                  status.type ===
                  "loading"
                }
                className="
                  mt-6
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-brand
                  px-6
                  py-4
                  font-display
                  text-sm
                  font-bold
                  uppercase
                  tracking-widest
                  text-white
                  transition-all
                  duration-300
                  hover:bg-brand-soft
                  hover:shadow-[0_0_40px_rgba(23,49,96,0.28)]
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                  sm:w-auto
                "
              >
                {status.type ===
                "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />

                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />

                    {
                      content.submitButtonText
                    }
                  </>
                )}
              </button>

              {/* =============================================
                  SUCCESS / ERROR
                  ============================================= */}

              <AnimatePresence>
                {status.type ===
                  "success" ||
                status.type ===
                  "error" ? (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -6,
                    }}
                    className={`
                      mt-4
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      px-4
                      py-3
                      text-sm
                      font-semibold

                      ${
                        status.type ===
                        "success"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                          : "border-brand/30 bg-brand/10 text-brand"
                      }
                    `}
                  >
                    {status.type ===
                    "success" ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                    )}

                    {
                      status.message
                    }
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </form>
          </BlurReveal>
        </div>
      </div>
    </section>
  );
}