"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2, Menu, X, Zap } from "lucide-react";
import { navLinks } from "@/lib/data";
import { GlitchText, Magnetic } from "./ui";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || open
            ? "border-b border-white/10 bg-black/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
          <a href="#home" className="group flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white shadow-[0_0_22px_rgba(255,0,0,0.55)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <Gamepad2 className="h-5 w-5" />
            </span>
            <GlitchText
              text="GAMEX"
              className="font-display text-xl font-extrabold tracking-widest text-white"
            />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => {
              const isActive = active === l.href;
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`relative block rounded-md px-3.5 py-2 text-sm font-semibold uppercase tracking-wider transition-colors ${
                      isActive ? "text-white" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {l.label}
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-brand shadow-[0_0_10px_rgba(255,0,0,0.8)]"
                      />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <Magnetic strength={0.3} className="hidden sm:inline-block">
              <a
                href="#contact"
                className="cta-pulse inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-brand-soft"
              >
                <Zap className="h-4 w-4" />
                Build Your Rig
              </a>
            </Magnetic>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-white transition-colors hover:border-brand/50 lg:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-3 px-8">
              {navLinks.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ delay: 0.08 * i + 0.08, duration: 0.4, ease: "easeOut" }}
                  className="font-display text-3xl font-extrabold uppercase tracking-wider text-zinc-200 transition-colors hover:text-brand"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="cta-pulse mt-8 inline-flex items-center gap-2 rounded-lg bg-brand px-8 py-3.5 font-display text-sm font-bold uppercase tracking-widest text-white"
              >
                <Zap className="h-4 w-4" />
                Build Your Rig
              </motion.a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
