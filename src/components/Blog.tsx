import Link from "next/link";

import {
  ArrowUpRight,
  CalendarDays,
  Clock,
} from "lucide-react";

import {
  DEFAULT_BLOG_CONTENT,
  DEFAULT_BLOG_POSTS,
  type BlogSectionContent,
  type PublicBlogPost,
} from "@/lib/blog";

import {
  SectionHeading,
  SpotlightCard,
} from "./ui";

import {
  BlurReveal,
  Parallax,
  ScrollSkew,
} from "./fx";

/* =========================================================
   BLOG
   ========================================================= */

export function Blog({
  content = DEFAULT_BLOG_CONTENT,
  posts = DEFAULT_BLOG_POSTS,
}: {
  content?: BlogSectionContent;
  posts?: PublicBlogPost[];
}) {
  /* =======================================================
     ADMIN VISIBILITY
     ======================================================= */

  if (!content.isVisible) {
    return null;
  }

  return (
    <section
      id="blog"
      className="
        relative
        overflow-hidden
        bg-[#fbfcfe]/80
        py-24
        md:py-32
      "
    >
      {/* ===================================================
          BACKGROUND EFFECT
          =================================================== */}

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
          bg-brand/10
          blur-[130px]
        "
      />

      <div
        className="
          mx-auto
          max-w-7xl
          px-5
          md:px-8
        "
      >
        {/* =================================================
            ADMIN-CONTROLLED HEADING
            ================================================= */}

        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          accent={
            content.accent
              ? content.accent
              : undefined
          }
          subtitle={content.subtitle}
        />

        {/* =================================================
            BLOG CARDS
            ================================================= */}

        {posts.length > 0 ? (
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
            {posts.map(
              (post, index) => (
                <BlurReveal
                  key={post.id}
                  delay={
                    index * 0.08
                  }
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
                      border-brand/15
                      bg-white
                      shadow-[0_18px_55px_-38px_rgba(23,49,96,0.30)]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-brand/30
                    "
                  >
                    {/* =======================================
                        IMAGE
                        ======================================= */}

                    <div
                      className="
                        relative
                        aspect-[16/10]
                        overflow-hidden
                      "
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
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
                          from-white
                          via-transparent
                          to-transparent
                        "
                      />

                      {/* CATEGORY */}

                      <span
                        className="
                          absolute
                          left-3
                          top-3
                          rounded-md
                          bg-brand/90
                          px-2.5
                          py-1
                          text-[11px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-white
                        "
                      >
                        {post.category}
                      </span>
                    </div>

                    {/* =======================================
                        CARD CONTENT
                        ======================================= */}

                    <div
                      className="
                        flex
                        flex-1
                        flex-col
                        p-5
                      "
                    >
                      {/* DATE / READ TIME */}

                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-x-4
                          gap-y-2
                          text-xs
                          uppercase
                          tracking-wider
                          text-slate-500
                        "
                      >
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1
                          "
                        >
                          <CalendarDays className="h-3.5 w-3.5" />

                          {post.date}
                        </span>

                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1
                          "
                        >
                          <Clock className="h-3.5 w-3.5" />

                          {post.readTime}
                        </span>
                      </div>

                      {/* TITLE */}

                      <h3
                        className="
                          mt-3
                          font-display
                          text-base
                          font-bold
                          leading-snug
                          text-brand-deep
                          transition-colors
                          group-hover:text-brand
                        "
                      >
                        {post.title}
                      </h3>

                      {/* EXCERPT */}

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

                      {/* =====================================
                          ARTICLE LINK
                          ===================================== */}

                      <Link
                        href={`/blog/${post.slug}`}
                        className="
                          mt-auto
                          inline-flex
                          items-center
                          gap-1.5
                          pt-4
                          text-sm
                          font-bold
                          uppercase
                          tracking-wider
                          text-brand
                          transition-colors
                          hover:text-brand-soft
                        "
                      >
                        {content.readMoreText}

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
                      </Link>
                    </div>
                  </SpotlightCard>
                </BlurReveal>
              )
            )}
          </ScrollSkew>
        ) : (
          /* =================================================
             NO POSTS

             We keep the Blog heading visible because the admin
             may intentionally have hidden/deleted every post.
             ================================================= */

          <div
            className="
              mt-14
              rounded-2xl
              border
              border-dashed
              border-brand/15
              bg-white/60
              px-6
              py-12
              text-center
            "
          >
            <p
              className="
                text-sm
                text-slate-500
              "
            >
              No Blog articles are currently available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}