"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { categories, products, type CategoryId } from "@/lib/data";
import { SectionHeading, SpotlightCard } from "./ui";
import { Parallax, ScrollSkew } from "./fx";

export function Products() {
  const [active, setActive] = useState<CategoryId>("all");
  const filtered = active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <section id="products" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute left-1/2 top-0 -z-10 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />
      <Parallax speed={100} className="pointer-events-none absolute -right-40 top-1/2 -z-10 h-[26rem] w-[26rem] rounded-full bg-brand/10 blur-[140px]" />
      <div className="bg-grid grid-animated absolute inset-0 -z-10 opacity-20 [mask-image:radial-gradient(ellipse_55%_55%_at_50%_50%,black,transparent)]" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="The Arsenal"
          title="Gear that wins matches"
          accent="wins"
          subtitle="From complete custom rigs to the silicon that powers them — browse the hardware we stock. Every build is custom-quoted, so hit us up for pricing."
        />

        {/* Category tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((c) => {
            const isActive = active === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`relative rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors ${
                  isActive ? "text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {isActive ? (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-brand shadow-[0_0_24px_rgba(255,0,0,0.4)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                ) : null}
                <span className="relative z-10">{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div layout className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.article
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <SpotlightCard className="group h-full rounded-2xl border border-brand/25 bg-ink-2 transition-colors duration-300 hover:border-brand/40">
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/10 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-md bg-black/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand backdrop-blur">
                      {p.tag}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-white transition-colors group-hover:text-brand">
                      {p.name}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{p.description}</p>

                    <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5">
                      {p.specs.map((s) => (
                        <li key={s} className="flex items-center gap-1.5 text-xs text-zinc-300">
                          <Check className="h-3.5 w-3.5 shrink-0 text-brand" />
                          {s}
                        </li>
                      ))}
                    </ul>

                    <a
                      href="#contact"
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-zinc-200 transition-colors hover:text-brand"
                    >
                      Enquire Now
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </SpotlightCard>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <p className="mt-10 text-center text-sm uppercase tracking-widest text-zinc-600">
          ✦ Custom-quoted — no fixed prices, always built to your spec ✦
        </p>
      </div>
    </section>
  );
}
