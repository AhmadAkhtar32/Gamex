import { ArrowRight, Check } from "lucide-react";
import { builds } from "@/lib/data";
import { SectionHeading, SpotlightCard } from "./ui";
import { BlurReveal, ScrollSkew } from "./fx";

export function Builds() {
  return (
    <section id="builds" className="relative overflow-hidden py-24 md:py-32">
      <div className="bg-grid grid-animated absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Custom Builds"
          title="Built for your playstyle"
          accent="your"
          subtitle="Three signature rigs, tuned and stress-tested by our engineers. Configure any of them — or design your own from scratch."
        />

        <ScrollSkew amount={2} className="mt-14 grid gap-6 lg:grid-cols-3">
          {builds.map((b, i) => (
            <BlurReveal key={b.name} delay={i * 0.1} className="h-full">
              <SpotlightCard className="group flex h-full flex-col rounded-2xl border border-brand/25 bg-ink-2 transition-colors duration-300 hover:border-brand/40">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={b.image}
                    alt={b.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 rounded-md border border-brand/40 bg-black/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand backdrop-blur">
                    {b.badge}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-2xl font-extrabold text-white">{b.name}</h3>
                  <p className="mt-0.5 text-sm font-semibold uppercase tracking-widest text-brand-soft">
                    {b.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{b.description}</p>

                  <ul className="mt-4 space-y-2">
                    {b.specs.map((s) => (
                      <li key={s} className="flex items-center gap-2 text-sm text-zinc-300">
                        <Check className="h-4 w-4 shrink-0 text-brand" />
                        {s}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className="mt-6 inline-flex items-center gap-2 self-start rounded-lg border border-white/15 px-5 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:border-brand/60 hover:bg-brand/10 hover:text-brand"
                  >
                    Configure This Build
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </SpotlightCard>
            </BlurReveal>
          ))}
        </ScrollSkew>
      </div>
    </section>
  );
}
