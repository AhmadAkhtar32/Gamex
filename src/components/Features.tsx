import {
  BadgeCheck,
  Gauge,
  RefreshCcw,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";
import { features } from "@/lib/data";
import { SectionHeading } from "./ui";
import { BlurReveal } from "./fx";

const ICONS: Record<string, typeof Wrench> = {
  wrench: Wrench,
  shield: ShieldCheck,
  gauge: Gauge,
  badge: BadgeCheck,
  zap: Zap,
  refresh: RefreshCcw,
};

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden py-24 md:py-32">
      <div className="animate-pulse-glow absolute -right-40 top-20 -z-10 h-[28rem] w-[28rem] rounded-full bg-brand/10 blur-[130px]" />
      <div className="bg-grid grid-animated absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Why Gamex"
          title="Engineered for peak performance"
          accent="peak"
          subtitle="We obsess over every frame, every degree and every detail — so your rig is as serious about winning as you are."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = ICONS[f.icon] ?? Zap;
            return (
              <BlurReveal key={f.title} delay={i * 0.07} className="h-full">
                <div className="group h-full rounded-2xl border border-brand/25 bg-ink-2 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_16px_40px_-16px_rgba(255,0,0,0.35)]">
                  <div className="grid h-12 w-12 place-items-center rounded-xl border border-brand/30 bg-brand/10 text-brand transition-all duration-300 group-hover:scale-110 group-hover:bg-brand group-hover:text-white group-hover:shadow-[0_0_24px_rgba(255,0,0,0.5)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.description}</p>
                </div>
              </BlurReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
