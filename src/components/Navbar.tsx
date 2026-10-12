"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Search, X, Zap } from "lucide-react";
import { WebsiteSearch } from "@/components/WebsiteSearch";
import gamexLogo from "@/app/logo.png";
import { Magnetic } from "./ui";
export type NavbarSettingsContent = {
  brandText: string;
  brandHref: string;
  logoImage: string;
  logoAlt: string;
  ctaText: string;
  ctaHref: string;
  ctaVisible: boolean;
  isVisible: boolean;
};
export type PublicNavbarLink = {
  id: number | string;
  label: string;
  href: string;
};
export const DEFAULT_NAVBAR_SETTINGS: NavbarSettingsContent = {
  brandText: "GAMEX",
  brandHref: "#home",
  logoImage: "",
  logoAlt: "Gamex",
  ctaText: "Build Your Rig",
  ctaHref: "#contact",
  ctaVisible: true,
  isVisible: true,
};
export const DEFAULT_NAVBAR_LINKS: PublicNavbarLink[] = [
  { id: "default-home", label: "Home", href: "#home" },
  { id: "default-products", label: "Products", href: "#products" },
  { id: "default-builds", label: "Custom Builds", href: "#builds" },
  { id: "default-features", label: "Why Gamex", href: "#features" },
  { id: "default-blog", label: "Blog", href: "#blog" },
  { id: "default-contact", label: "Contact", href: "#contact" },
];
function isExternalLink(href: string) {
  return href.startsWith("https://") || href.startsWith("http://");
}
function mobileHref(href: string) {
  return href.startsWith("#") ? `/${href}` : href;
}
export function Navbar({ settings = DEFAULT_NAVBAR_SETTINGS, links = DEFAULT_NAVBAR_LINKS }: {
  settings?: NavbarSettingsContent;
  links?: PublicNavbarLink[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const logoSrc = settings.logoImage?.trim() ? settings.logoImage : gamexLogo.src;
  const requiredMobileLinks: PublicNavbarLink[] = [
    { id: "mobile-products", label: "Products", href: "/#products" },
    { id: "mobile-categories", label: "Categories", href: "/#products" },
    { id: "mobile-rigs", label: "Rigs", href: "/#builds" },
    { id: "mobile-builder", label: "Build Your Rig", href: "/build-your-rig" },
    { id: "mobile-contact", label: "Contact Us", href: "/#contact" },
  ];
  const mobileLinks = [
    ...requiredMobileLinks,
    ...links.filter((link) => {
      const href = mobileHref(link.href);
      const label = link.label.trim().toLowerCase();
      return !requiredMobileLinks.some((required) => required.href === href) &&
        !["products", "categories", "rigs", "custom builds", "build your rig", "contact", "contact us"].includes(label);
    }),
  ];
  const customMobileCta = settings.ctaVisible && settings.ctaText.trim().toLowerCase() !== "build your rig" &&
    !mobileLinks.some((link) => mobileHref(link.href) === mobileHref(settings.ctaHref) && link.label === settings.ctaText);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const ids = links.filter((link) => link.href.startsWith("#")).map((link) => link.href.replace("#", "")).filter(Boolean);
    if (!ids.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [links]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const handleResize = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", handleResize);
    return () => desktop.removeEventListener("change", handleResize);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => {
      mobileMenuRef.current?.scrollTo({ top: 0 });
      mobileMenuRef.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        menuButtonRef.current?.focus({ preventScroll: true });
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [menuButtonRef.current, ...Array.from(mobileMenuRef.current?.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]") ?? [])]
        .filter((element): element is HTMLElement => Boolean(element && element.getClientRects().length));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const focused = document.activeElement;
      const outside = !focusable.some((element) => element === focused);
      if (event.shiftKey && (focused === first || outside)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (focused === last || outside)) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);
  function openMobileSearch() {
    setOpen(false);
    // Release the menu scroll lock before the search dialog takes over.
    window.requestAnimationFrame(() => setSearchOpen(true));
  }
  if (!settings.isVisible) return null;
  return (
    <>
      <WebsiteSearch open={searchOpen} onClose={closeSearch} />
      <motion.header initial={{ y: -90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.65, ease: "easeOut" }} className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled || open ? "border-brand/15 bg-white/95 shadow-[0_12px_45px_-26px_rgba(230,0,0,0.25)] backdrop-blur-xl" : "border-black/[0.06] bg-white/90 backdrop-blur-md"}`}>
        <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent transition-opacity duration-300 ${scrolled ? "opacity-100" : "opacity-60"}`} />
        <nav aria-label="Main navigation" className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-5 md:h-20 md:px-8">
          <a href={settings.brandHref} aria-label={settings.logoAlt || settings.brandText || "Gamex"} className="group relative flex min-w-0 shrink-0 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} alt={settings.logoAlt || "Gamex"} className="h-9 w-auto max-w-[145px] object-contain object-left transition-all duration-300 group-hover:scale-[1.04] sm:h-10 sm:max-w-[165px] md:h-11 md:max-w-[190px] xl:h-12 xl:max-w-[210px]" />
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-[10%] -bottom-2 h-3 rounded-full bg-brand/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
          </a>
          <ul className="hidden min-w-0 items-center gap-0.5 xl:flex xl:gap-1">
            {links.map((link) => {
              const isActive = active === link.href;
              const external = isExternalLink(link.href);
              return (
                <li key={link.id}>
                  <a href={link.href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={`group/nav relative block rounded-lg px-2.5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 xl:px-3.5 xl:text-sm ${isActive ? "bg-brand/[0.06] text-brand" : "text-[#2b2b2b] hover:bg-brand/[0.04] hover:text-brand"}`}>
                    {link.label}
                    {isActive ? <motion.span layoutId="nav-active" className="absolute inset-x-2 -bottom-0.5 h-[2px] rounded-full bg-brand shadow-[0_0_12px_rgba(230,0,0,0.45)]" /> : <span className="absolute inset-x-1/2 -bottom-0.5 h-[2px] rounded-full bg-brand opacity-0 transition-all duration-300 group-hover/nav:inset-x-2 group-hover/nav:opacity-100" />}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="flex shrink-0 items-center gap-3">
            <button type="button" aria-label={searchOpen ? "Close website search" : "Search website"} aria-expanded={searchOpen} aria-haspopup="dialog" onClick={() => { setOpen(false); setSearchOpen((value) => !value); }} className="hidden h-10 w-10 place-items-center rounded-lg border border-brand/20 bg-white text-brand transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand xl:grid">
              <Search className="h-5 w-5" />
            </button>
            {settings.ctaVisible && (
              <Magnetic strength={0.3} className="hidden xl:inline-block">
                <a href={settings.ctaHref} target={isExternalLink(settings.ctaHref) ? "_blank" : undefined} rel={isExternalLink(settings.ctaHref) ? "noopener noreferrer" : undefined} className="group/cta relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-brand px-4 py-2.5 font-display text-[10px] font-bold uppercase tracking-widest text-white shadow-[0_12px_32px_-16px_rgba(230,0,0,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#c80000] hover:shadow-[0_18px_38px_-16px_rgba(230,0,0,0.8)] md:px-5 md:text-xs">
                  <span aria-hidden="true" className="absolute -left-10 top-0 h-full w-8 -skew-x-12 bg-white/25 transition-all duration-700 group/cta:left-[120%]" />
                  <Zap className="relative h-4 w-4" />
                  <span className="relative">{settings.ctaText}</span>
                </a>
              </Magnetic>
            )}
            <button ref={menuButtonRef} type="button" onClick={() => { setSearchOpen(false); setOpen((value) => !value); }} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-brand/20 bg-white text-brand shadow-[0_8px_24px_-16px_rgba(230,0,0,0.5)] transition-all duration-300 hover:border-brand/50 hover:bg-brand/[0.05] focus:outline-none focus:ring-4 focus:ring-brand/10 xl:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div ref={mobileMenuRef} id="mobile-navigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} data-lenis-prevent data-lenis-prevent-wheel data-lenis-prevent-touch className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-x-hidden overflow-y-auto overscroll-contain bg-white/98 backdrop-blur-xl md:top-20 xl:hidden">
            <div aria-hidden="true" className="pointer-events-none absolute -right-28 top-16 h-72 w-72 rounded-full bg-brand/[0.08] blur-[90px]" />
            <div aria-hidden="true" className="pointer-events-none absolute -left-28 bottom-10 h-72 w-72 rounded-full bg-brand/[0.05] blur-[100px]" />
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent" />
            <div className="relative mx-auto w-full max-w-lg px-5 py-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <button type="button" onClick={openMobileSearch} aria-haspopup="dialog" className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-brand/15 bg-slate-50 px-4 py-3 text-left font-sans text-sm text-slate-500 transition-colors hover:border-brand/30 focus-visible:outline-2 focus-visible:outline-brand">
                <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-brand" />
                <span>Search products, builds and more...</span>
              </button>
              <p className="mb-3 mt-6 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Explore GameX</p>
              <nav aria-label="Mobile navigation" className="space-y-2">
                {mobileLinks.map((link, index) => {
                  const href = mobileHref(link.href);
                  const external = isExternalLink(href);
                  const isActive = link.label !== "Categories" && (active === link.href || `/${active}` === href);
                  return (
                    <motion.div key={link.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.025, 0.15), duration: 0.2 }}>
                      <Link href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} onClick={() => setOpen(false)} className={`flex min-h-12 w-full min-w-0 items-center justify-between gap-3 rounded-xl border px-4 py-3 font-sans text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-brand ${link.id === "mobile-builder" ? "border-brand bg-brand text-white shadow-sm" : isActive ? "border-brand/20 bg-brand/[0.06] text-brand" : "border-slate-100 bg-white text-slate-800 hover:border-brand/20 hover:bg-brand/[0.04]"}`}>
                        <span className="flex min-w-0 items-center gap-2">
                          {link.id === "mobile-builder" && <Zap aria-hidden="true" className="h-4 w-4 shrink-0" />}
                          <span className="break-words">{link.label}</span>
                        </span>
                        <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 opacity-60" />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
              {customMobileCta && (
                <Link href={mobileHref(settings.ctaHref)} target={isExternalLink(settings.ctaHref) ? "_blank" : undefined} rel={isExternalLink(settings.ctaHref) ? "noopener noreferrer" : undefined} onClick={() => setOpen(false)} className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 font-sans text-sm font-bold text-white hover:bg-[#c80000]">
                  <Zap className="h-4 w-4" />{settings.ctaText}
                </Link>
              )}
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6 text-center text-[9px] font-bold uppercase tracking-[0.3em] text-black/30">Game • Build • Dominate</motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}