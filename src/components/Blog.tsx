import { ArrowUpRight, Clock, CalendarDays } from "lucide-react";
import type { BlogPost } from "@/lib/data";
import { SectionHeading, SpotlightCard } from "./ui";
import { BlurReveal, Parallax, ScrollSkew } from "./fx";

export function Blog({ posts }: { posts: BlogPost[] }) {
  return (
    <section id="blog" className="relative overflow-hidden py-24 md:py-32">
      <Parallax speed={120} className="pointer-events-none absolute -left-32 top-1/3 -z-10 h-[24rem] w-[24rem] rounded-full bg-brand/10 blur-[130px]" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="The Gamex Blog"
          title="Intel from the bench"
          accent="bench"
          subtitle="Build guides, benchmarks and hardware breakdowns from the Gamex engineering team."
        />

        <ScrollSkew amount={2} className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {posts.map((post, i) => (
            <BlurReveal key={post.id} delay={i * 0.08} className="h-full">
              <SpotlightCard className="group flex h-full flex-col rounded-2xl border border-brand/25 bg-ink-2 transition-colors duration-300 hover:border-brand/40">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 rounded-md bg-brand/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                    {post.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-4 text-xs uppercase tracking-wider text-zinc-500">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {post.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-base font-bold leading-snug text-white transition-colors group-hover:text-brand">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{post.excerpt}</p>

                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold uppercase tracking-wider text-zinc-300 transition-colors group-hover:text-brand">
                    Read Story
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </SpotlightCard>
            </BlurReveal>
          ))}
        </ScrollSkew>
      </div>
    </section>
  );
}
