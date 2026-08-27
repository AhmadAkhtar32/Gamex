"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";
import { submitContact } from "@/app/actions";
import {
  InstagramIcon,
  TwitchIcon,
  XIcon,
  YoutubeIcon,
} from "./social-icons";
import { SectionHeading } from "./ui";
import { BlurReveal, Parallax } from "./fx";

type Status = {
  type: "idle" | "loading" | "success" | "error";
  message: string;
};

const inputCls =
  "w-full rounded-xl border border-brand/15 bg-white px-4 py-3.5 text-brand-deep placeholder:text-slate-400 outline-none transition-all duration-300 hover:border-brand/25 focus:border-brand/60 focus:shadow-[0_0_0_3px_rgba(23,49,96,0.10)]";

const INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@gamex.gg",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "0303-6009123",
  },
  {
    icon: MapPin,
    label: "HQ",
    value: "17-A Airport Road Divine Garden Lahore",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "24/7 — we never sleep",
  },
];

export function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<Status>({
    type: "idle",
    message: "",
  });

  function update(
    key: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    setStatus({
      type: "loading",
      message: "Transmitting...",
    });

    const response = await submitContact(form);

    if (response.success) {
      setStatus({
        type: "success",
        message: response.message,
      });

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } else {
      setStatus({
        type: "error",
        message: response.message,
      });
    }
  }

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
      {/* =====================================================
          BACKGROUND EFFECTS
          ===================================================== */}

      <div
        className="
          bg-grid
          grid-animated
          absolute
          inset-0
          -z-10
          opacity-25
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
          bg-brand/[0.055]
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
          bg-brand-soft/[0.045]
          blur-[130px]
        "
      />

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Contact Us"
          title="Let's build your dream rig"
          accent="dream"
          subtitle="Got a build in mind or a question about components? Drop us a message — our team replies within 24 hours."
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
              INFO COLUMN
              ================================================= */}

          <div className="space-y-4 lg:col-span-2">
            {INFO.map((item, index) => {
              const Icon = item.icon;

              return (
                <BlurReveal
                  key={item.label}
                  delay={index * 0.06}
                >
                  <div
                    className="
                      group
                      flex
                      items-center
                      gap-4

                      rounded-2xl

                      border
                      border-brand/12

                      bg-[#f7f9fc]

                      p-5

                      shadow-[0_14px_38px_-30px_rgba(23,49,96,0.35)]

                      transition-all
                      duration-300

                      hover:-translate-y-0.5
                      hover:border-brand/28
                      hover:bg-white
                      hover:shadow-[0_22px_48px_-30px_rgba(23,49,96,0.45)]
                    "
                  >
                    {/* Icon */}
                    <div
                      className="
                        grid
                        h-12
                        w-12
                        shrink-0
                        place-items-center

                        rounded-xl

                        border
                        border-brand/18

                        bg-brand/[0.07]

                        text-brand

                        transition-all
                        duration-300

                        group-hover:scale-110
                        group-hover:border-brand
                        group-hover:bg-brand
                        group-hover:text-white
                      "
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Text */}
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
                          mt-0.5
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
            })}

            {/* ===============================================
                SOCIAL LINKS
                =============================================== */}

            <BlurReveal delay={0.3}>
              <div
                className="
                  rounded-2xl

                  border
                  border-brand/12

                  bg-brand/[0.045]

                  p-5

                  shadow-[0_14px_38px_-30px_rgba(23,49,96,0.3)]
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

                  Follow the squad
                </p>

                <div className="mt-4 flex gap-3">
                  {[
                    XIcon,
                    InstagramIcon,
                    YoutubeIcon,
                    TwitchIcon,
                  ].map((Icon, index) => (
                    <a
                      key={index}
                      href="#contact"
                      aria-label="Social link"
                      className="
                        grid
                        h-10
                        w-10
                        place-items-center

                        rounded-lg

                        border
                        border-brand/12

                        bg-white

                        text-slate-600

                        shadow-sm

                        transition-all
                        duration-300

                        hover:-translate-y-0.5
                        hover:border-brand
                        hover:bg-brand
                        hover:text-white
                        hover:shadow-[0_10px_24px_-14px_rgba(23,49,96,0.6)]
                      "
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </BlurReveal>
          </div>

          {/* =================================================
              FORM COLUMN
              ================================================= */}

          <BlurReveal
            delay={0.1}
            className="lg:col-span-3"
          >
            <form
              onSubmit={onSubmit}
              className="
                rounded-3xl

                border
                border-brand/12

                bg-[#f7f9fc]

                p-6

                shadow-[0_30px_80px_-45px_rgba(23,49,96,0.32)]

                md:p-8
              "
            >
              {/* =============================================
                  NAME + EMAIL
                  ============================================= */}

              <div className="grid gap-4 sm:grid-cols-2">
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
                    Name
                  </label>

                  <input
                    id="name"
                    value={form.name}
                    onChange={(event) =>
                      update(
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="Your name"
                    className={inputCls}
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
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      update(
                        "email",
                        event.target.value
                      )
                    }
                    placeholder="you@email.com"
                    className={inputCls}
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
                  Subject
                </label>

                <input
                  id="subject"
                  value={form.subject}
                  onChange={(event) =>
                    update(
                      "subject",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Custom PC quote for 1440p gaming"
                  className={inputCls}
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
                  Message
                </label>

                <textarea
                  id="message"
                  value={form.message}
                  onChange={(event) =>
                    update(
                      "message",
                      event.target.value
                    )
                  }
                  placeholder="Tell us about the build you want, your budget range and any games you play..."
                  rows={5}
                  className={`${inputCls} resize-none`}
                  required
                />
              </div>

              {/* =============================================
                  SUBMIT BUTTON
                  ============================================= */}

              <button
                type="submit"
                disabled={
                  status.type === "loading"
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

                  shadow-[0_14px_34px_-16px_rgba(23,49,96,0.65)]

                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:bg-brand-soft
                  hover:shadow-[0_18px_42px_-16px_rgba(23,49,96,0.7)]

                  disabled:cursor-not-allowed
                  disabled:opacity-70

                  sm:w-auto
                "
              >
                {status.type === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />

                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />

                    Send Message
                  </>
                )}
              </button>

              {/* =============================================
                  SUCCESS / ERROR MESSAGE
                  ============================================= */}

              <AnimatePresence>
                {status.type === "success" ||
                status.type === "error" ? (
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
                          ? `
                            border-emerald-500/20
                            bg-emerald-50
                            text-emerald-700
                          `
                          : `
                            border-brand/20
                            bg-brand/[0.06]
                            text-brand
                          `
                      }
                    `}
                  >
                    {status.type ===
                    "success" ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                    )}

                    {status.message}
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