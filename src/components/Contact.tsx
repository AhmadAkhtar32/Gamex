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
import { InstagramIcon, TwitchIcon, XIcon, YoutubeIcon } from "./social-icons";
import { SectionHeading } from "./ui";
import { BlurReveal, Parallax } from "./fx";

type Status = { type: "idle" | "loading" | "success" | "error"; message: string };

const inputCls =
  "w-full rounded-xl border border-brand/25 bg-ink-2 px-4 py-3.5 text-white placeholder:text-zinc-600 outline-none transition-all duration-300 focus:border-brand/70 focus:shadow-[0_0_0_3px_rgba(255,0,0,0.15)]";

const INFO = [
  { icon: Mail, label: "Email", value: "hello@gamex.gg" },
  { icon: Phone, label: "Phone", value: "0303-6009123" },
  { icon: MapPin, label: "HQ", value: "17-A Airport Road Divine Garden Lahore" },
  { icon: Clock, label: "Hours", value: "24/7 — we never sleep" },
];

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus({ type: "loading", message: "Transmitting..." });
    const res = await submitContact(form);
    if (res.success) {
      setStatus({ type: "success", message: res.message });
      setForm({ name: "", email: "", subject: "", message: "" });
    } else {
      setStatus({ type: "error", message: res.message });
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-24 md:py-32">
      <div className="bg-grid grid-animated absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      <div className="animate-pulse-glow absolute -left-40 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-brand/15 blur-[130px]" />
      <Parallax speed={120} className="pointer-events-none absolute -right-32 top-20 -z-10 h-[22rem] w-[22rem] rounded-full bg-brand/10 blur-[130px]" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Contact Us"
          title="Let's build your dream rig"
          accent="dream"
          subtitle="Got a build in mind or a question about components? Drop us a message — our team replies within 24 hours."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          {/* Info column */}
          <div className="space-y-4 lg:col-span-2">
            {INFO.map((item, i) => {
              const Icon = item.icon;
              return (
                <BlurReveal key={item.label} delay={i * 0.06}>
                  <div className="group flex items-center gap-4 rounded-2xl border border-brand/25 bg-ink-2 p-5 transition-colors duration-300 hover:border-brand/40">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-brand/30 bg-brand/10 text-brand transition-all duration-300 group-hover:scale-110 group-hover:bg-brand group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                        {item.label}
                      </p>
                      <p className="font-semibold text-white">{item.value}</p>
                    </div>
                  </div>
                </BlurReveal>
              );
            })}

            <BlurReveal delay={0.3}>
              <div className="rounded-2xl border border-brand/20 bg-brand/5 p-5">
                <p className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-brand">
                  <MessageSquare className="h-4 w-4" /> Follow the squad
                </p>
                <div className="mt-4 flex gap-3">
                  {[XIcon, InstagramIcon, YoutubeIcon, TwitchIcon].map((Icon, i) => (
                    <a
                      key={i}
                      href="#contact"
                      aria-label="Social link"
                      className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-zinc-300 transition-all duration-300 hover:border-brand/50 hover:bg-brand hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </BlurReveal>
          </div>

          {/* Form column */}
          <BlurReveal delay={0.1} className="lg:col-span-3">
            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-brand/25 bg-ink-2 p-6 shadow-[0_30px_80px_-40px_rgba(255,0,0,0.4)] md:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Name
                  </label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Your name"
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@email.com"
                    className={inputCls}
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="subject" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Subject
                </label>
                <input
                  id="subject"
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  placeholder="e.g. Custom PC quote for 1440p gaming"
                  className={inputCls}
                  required
                />
              </div>

              <div className="mt-4">
                <label htmlFor="message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Message
                </label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Tell us about the build you want, your budget range and any games you play..."
                  rows={5}
                  className={`${inputCls} resize-none`}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status.type === "loading"}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-4 font-display text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-brand-soft hover:shadow-[0_0_40px_rgba(255,0,0,0.55)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {status.type === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Send Message
                  </>
                )}
              </button>

              <AnimatePresence>
                {status.type === "success" || status.type === "error" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={`mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
                      status.type === "success"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-brand/30 bg-brand/10 text-brand"
                    }`}
                  >
                    {status.type === "success" ? (
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
