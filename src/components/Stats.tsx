import { stats } from "@/lib/data";
import { CountUp } from "./ui";
import { BlurReveal } from "./fx";

export function Stats() {
  return (
    <section className="relative overflow-hidden border-y border-brand/30 bg-ink-2/70">
      <div className="animated-gradient absolute inset-x-0 top-0 h-px [background-image:linear-gradient(90deg,transparent,#ff0000,#ff3b3b,transparent)]" />
      <div className="absolute left-1/2 top-0 -z-10 h-40 w-[30rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[100px]" />

      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-white/10 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`group flex flex-col items-center gap-2 px-4 py-10 text-center md:py-12 ${
              i > 0 ? "border-l border-white/10" : ""
            } ${i % 2 === 1 ? "border-l-0 lg:border-l" : ""}`}
          >
            <BlurReveal delay={i * 0.08}>
              <div className="font-display text-4xl font-black text-white transition-colors duration-300 group-hover:text-brand md:text-5xl">
                <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-zinc-500">
                {s.label}
              </p>
            </BlurReveal>
          </div>
        ))}
      </div>
    </section>
  );
}
