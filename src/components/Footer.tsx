import { Gamepad2, ArrowUp } from "lucide-react";
import { navLinks } from "@/lib/data";
import { InstagramIcon, TwitchIcon, XIcon, YoutubeIcon } from "./social-icons";

export function Footer() {
  return (
    <footer className="relative border-t border-brand/20 bg-black">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <a href="#home" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white shadow-[0_0_22px_rgba(255,0,0,0.55)]">
                <Gamepad2 className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-extrabold tracking-widest text-white">
                GAME<span className="text-brand">X</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
              Premium gaming hardware for players who refuse to lose. Custom PCs, GPUs, RAM,
              processors and pro accessories — built to win.
            </p>
            <div className="mt-5 flex gap-3">
              {[XIcon, InstagramIcon, YoutubeIcon, TwitchIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#home"
                  aria-label="Social link"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-zinc-400 transition-all duration-300 hover:border-brand/50 hover:bg-brand hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-white">
              Navigate
            </h4>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-brand"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-white">
              Get in touch
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-zinc-500">
              <li>hello@gamex.gg</li>
              <li>+1 (555) 010-1234</li>
              <li>Neon District, Tech City</li>
            </ul>
            <a
              href="#contact"
              className="cta-pulse mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-brand-soft"
            >
              Start Your Build
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} Gamex. All rights reserved. Play hard.
          </p>
          <a
            href="#home"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500 transition-colors hover:text-brand"
          >
            Back to top <ArrowUp className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
