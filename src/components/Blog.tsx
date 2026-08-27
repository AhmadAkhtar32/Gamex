import {
  ArrowUpRight,
  Clock,
  CalendarDays,
} from "lucide-react";
import type { BlogPost } from "@/lib/data";
import {
  SectionHeading,
  SpotlightCard,
} from "./ui";
import {
  BlurReveal,
  Parallax,
  ScrollSkew,
} from "./fx";

export function Blog({
  posts,
}: {
  posts: BlogPost[];
}) {
  return (
    <section
      id="blog"
      className="
        relative
        overflow-hidden
        bg-[#f7f9fc]
        py-24
        md:py-32
      "
    >
      {/* =====================================================
          BACKGROUND EFFECTS
          ===================================================== */}

      <Parallax
        speed={120}
        className="
          pointer-events-none
          absolute
          -left-32
          top-1/3
          -z-10
          h-[24rem]
          w-[24rem]
          rounded-full
          bg-brand/[0.05]
          blur-[130px]
        "
      />

      <div
        className="
          absolute
          -right-36
          bottom-0
          -z-10
          h-[26rem]
          w-[26rem]
          rounded-full
          bg-brand-soft/[0.04]
          blur-[140px]
        "
      />

      <div
        className="
          bg-grid
          grid-animated
          absolute
          inset-0
          -z-10
          opacity-20
          [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]
        "
      />

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="The Gamex Blog"
          title="Intel from the bench"
          accent="bench"
          subtitle="Build guides, benchmarks and hardware breakdowns from the Gamex engineering team."
        />

        {/* ===================================================
            BLOG GRID
            =================================================== */}

        <ScrollSkew
          amount={2}
          className="
            mt-14
            grid
            gap-6
            md:grid-cols-2
            lg:grid-cols-4
          "
        >
          {posts.map((post, index) => (
            <BlurReveal
              key={post.id}
              delay={index * 0.08}
              className="h-full"
            >
              <SpotlightCard
                className="
                  group
                  flex
                  h-full
                  flex-col
                  rounded-2xl

                  border
                  border-brand/12

                  bg-white

                  shadow-[0_18px_50px_-34px_rgba(23,49,96,0.36)]

                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:border-brand/28
                  hover:shadow-[0_28px_65px_-34px_rgba(23,49,96,0.46)]
                "
              >
                {/* =========================================
                    BLOG IMAGE
                    ========================================= */}

                <div
                  className="
                    relative
                    aspect-[16/10]
                    overflow-hidden
                    bg-[#edf3f8]
                  "
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="
                      h-full
                      w-full
                      object-cover

                      transition-transform
                      duration-700
                      ease-out

                      group-hover:scale-110
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/25
                      via-transparent
                      to-black/[0.03]
                    "
                  />

                  {/* Category badge */}

                  <span
                    className="
                      absolute
                      left-3
                      top-3

                      rounded-md

                      border
                      border-white/40

                      bg-brand/95

                      px-2.5
                      py-1

                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-white

                      shadow-[0_8px_20px_-12px_rgba(23,49,96,0.7)]

                      backdrop-blur-sm
                    "
                  >
                    {post.category}
                  </span>
                </div>

                {/* =========================================
                    BLOG CONTENT
                    ========================================= */}

                <div
                  className="
                    flex
                    flex-1
                    flex-col
                    p-5
                  "
                >
                  {/* Metadata */}

                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-x-4
                      gap-y-2

                      text-xs
                      font-medium
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                      "
                    >
                      <CalendarDays className="h-3.5 w-3.5 text-brand" />

                      {post.date}
                    </span>

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                      "
                    >
                      <Clock className="h-3.5 w-3.5 text-brand" />

                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}

                  <h3
                    className="
                      mt-3

                      font-display
                      text-base
                      font-bold
                      leading-snug
                      text-brand-deep

                      transition-colors
                      duration-300

                      group-hover:text-brand
                    "
                  >
                    {post.title}
                  </h3>

                  {/* Excerpt */}

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-relaxed
                      text-slate-600
                    "
                  >
                    {post.excerpt}
                  </p>

                  {/* Read Story */}

                  <span
                    className="
                      mt-auto
                      inline-flex
                      items-center
                      gap-1.5
                      pt-4

                      font-display
                      text-sm
                      font-bold
                      uppercase
                      tracking-wider
                      text-brand

                      transition-colors
                      duration-300

                      group-hover:text-brand-soft
                    "
                  >
                    Read Story

                    <ArrowUpRight
                      className="
                        h-4
                        w-4

                        transition-transform
                        duration-300

                        group-hover:translate-x-0.5
                        group-hover:-translate-y-0.5
                      "
                    />
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