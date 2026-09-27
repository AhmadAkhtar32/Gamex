import Link from "next/link";

import {
  ArrowRight,
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
        bg-[#fffafa]
        py-24
        md:py-32
      "
    >
      {/* ===================================================
          TOP RED DIVIDER
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-px
          w-[80%]
          -translate-x-1/2
          bg-gradient-to-r
          from-transparent
          via-brand/20
          to-transparent
        "
      />

      {/* ===================================================
          BACKGROUND GRID
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          bg-grid
          pointer-events-none
          absolute
          inset-0
          -z-10
          opacity-25
          [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,black,transparent)]
        "
      />

      {/* ===================================================
          LEFT RED PARALLAX GLOW
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
          bg-brand/[0.07]
          blur-[130px]
        "
      />

      {/* ===================================================
          RIGHT RED GLOW
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-40
          bottom-12
          -z-10
          h-[28rem]
          w-[28rem]
          rounded-full
          bg-brand-soft/[0.05]
          blur-[140px]
        "
      />

      {/* ===================================================
          CONTENT
          =================================================== */}

      <div
        className="
          relative
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
          <>
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
                (
                  post,
                  index
                ) => (
                  <BlurReveal
                    key={post.id}
                    delay={
                      index *
                      0.08
                    }
                    className="h-full"
                  >
                    <SpotlightCard
                      className="
                        group
                        relative
                        flex
                        h-full
                        flex-col
                        overflow-hidden
                        rounded-2xl
                        border
                        border-black/[0.07]
                        bg-white
                        shadow-[0_20px_55px_-38px_rgba(0,0,0,0.25)]
                        transition-all
                        duration-300
                        hover:-translate-y-1.5
                        hover:border-brand/25
                        hover:shadow-[0_28px_65px_-38px_rgba(230,0,0,0.32)]
                      "
                    >
                      {/* =====================================
                          RED TOP HOVER LINE
                          ===================================== */}

                      <div
                        aria-hidden="true"
                        className="
                          absolute
                          left-0
                          top-0
                          z-20
                          h-[3px]
                          w-0
                          bg-brand
                          transition-all
                          duration-500
                          group-hover:w-full
                        "
                      />

                      {/* =====================================
                          IMAGE
                          ===================================== */}

                      <Link
                        href={`/blog/${post.slug}`}
                        className="
                          relative
                          block
                          aspect-[16/10]
                          overflow-hidden
                          bg-[#fff5f5]
                        "
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}

                        <img
                          src={
                            post.image
                          }
                          alt={
                            post.title
                          }
                          loading="lazy"
                          className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-700
                            ease-out
                            group-hover:scale-105
                          "
                        />

                        {/* ===================================
                            IMAGE DARK GRADIENT
                            =================================== */}

                        <div
                          aria-hidden="true"
                          className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-black/45
                            via-black/[0.03]
                            to-transparent
                          "
                        />

                        {/* ===================================
                            RED IMAGE TINT
                            =================================== */}

                        <div
                          aria-hidden="true"
                          className="
                            absolute
                            inset-0
                            bg-gradient-to-tr
                            from-brand/[0.08]
                            via-transparent
                            to-transparent
                          "
                        />

                        {/* ===================================
                            CATEGORY
                            =================================== */}

                        <span
                          className="
                            absolute
                            left-3
                            top-3
                            rounded-full
                            border
                            border-white/25
                            bg-brand
                            px-3
                            py-1.5
                            text-[10px]
                            font-extrabold
                            uppercase
                            tracking-wider
                            text-white
                            shadow-[0_10px_25px_-14px_rgba(230,0,0,0.65)]
                            backdrop-blur-md
                          "
                        >
                          {
                            post.category
                          }
                        </span>
                      </Link>

                      {/* =====================================
                          CARD CONTENT
                          ===================================== */}

                      <div
                        className="
                          flex
                          flex-1
                          flex-col
                          p-5
                        "
                      >
                        {/* ===================================
                            DATE / READ TIME
                            =================================== */}

                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-x-4
                            gap-y-2
                            text-[10px]
                            font-bold
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
                            <CalendarDays
                              className="
                                h-3.5
                                w-3.5
                                text-brand
                              "
                            />

                            {
                              post.date
                            }
                          </span>

                          <span
                            className="
                              inline-flex
                              items-center
                              gap-1.5
                            "
                          >
                            <Clock
                              className="
                                h-3.5
                                w-3.5
                                text-brand
                              "
                            />

                            {
                              post.readTime
                            }
                          </span>
                        </div>

                        {/* ===================================
                            TITLE
                            =================================== */}

                        <Link
                          href={`/blog/${post.slug}`}
                          className="block"
                        >
                          <h3
                            className="
                              mt-4
                              font-display
                              text-base
                              font-extrabold
                              leading-snug
                              text-brand-deep
                              transition-colors
                              duration-300
                              group-hover:text-brand
                            "
                          >
                            {
                              post.title
                            }
                          </h3>
                        </Link>

                        {/* ===================================
                            RED DIVIDER
                            =================================== */}

                        <div
                          className="
                            mt-3
                            h-[2px]
                            w-7
                            rounded-full
                            bg-brand/30
                            transition-all
                            duration-300
                            group-hover:w-11
                            group-hover:bg-brand
                          "
                        />

                        {/* ===================================
                            EXCERPT
                            =================================== */}

                        <p
                          className="
                            mt-3
                            line-clamp-3
                            text-sm
                            leading-relaxed
                            text-slate-600
                          "
                        >
                          {
                            post.excerpt
                          }
                        </p>

                        {/* ===================================
                            ARTICLE LINK
                            =================================== */}

                        <div
                          className="
                            mt-auto
                            pt-5
                          "
                        >
                          <Link
                            href={`/blog/${post.slug}`}
                            className="
                              inline-flex
                              w-full
                              items-center
                              justify-between
                              gap-2
                              rounded-xl
                              border
                              border-black/[0.07]
                              bg-[#fff8f8]
                              px-4
                              py-3
                              text-[11px]
                              font-extrabold
                              uppercase
                              tracking-wider
                              text-brand-deep
                              transition-all
                              duration-300
                              hover:border-brand
                              hover:bg-brand
                              hover:text-white
                              hover:shadow-[0_12px_30px_-18px_rgba(230,0,0,0.65)]
                            "
                          >
                            {
                              content.readMoreText
                            }

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
                      </div>

                      {/* =====================================
                          BOTTOM DECORATION
                          ===================================== */}

                      <div
                        aria-hidden="true"
                        className="
                          pointer-events-none
                          absolute
                          -bottom-10
                          -right-10
                          h-24
                          w-24
                          rounded-full
                          bg-brand/[0.035]
                          blur-2xl
                          transition-all
                          duration-500
                          group-hover:bg-brand/[0.08]
                        "
                      />
                    </SpotlightCard>
                  </BlurReveal>
                )
              )}
            </ScrollSkew>

            {/* ===============================================
                VIEW ALL ARTICLES
                =============================================== */}

            <BlurReveal
              delay={0.15}
              className="
                mt-12
                flex
                justify-center
              "
            >
              <Link
                href="/blog"
                className="
                  group
                  relative
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  overflow-hidden
                  rounded-xl
                  bg-brand
                  px-7
                  py-3.5
                  font-display
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-white
                  shadow-[0_15px_38px_-18px_rgba(230,0,0,0.7)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#c90000]
                  hover:shadow-[0_20px_42px_-18px_rgba(230,0,0,0.8)]
                "
              >
                {/* ===========================================
                    BUTTON SHINE
                    =========================================== */}

                <span
                  aria-hidden="true"
                  className="
                    absolute
                    -left-12
                    top-0
                    h-full
                    w-10
                    -skew-x-12
                    bg-white/20
                    transition-all
                    duration-700
                    group-hover:left-[120%]
                  "
                />

                <span className="relative">
                  View All Articles
                </span>

                <ArrowRight
                  className="
                    relative
                    h-4
                    w-4
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>
            </BlurReveal>
          </>
        ) : (
          /* =================================================
             NO POSTS
             ================================================= */

          <div
            className="
              mt-14
              rounded-2xl
              border
              border-dashed
              border-brand/20
              bg-white
              px-6
              py-14
              text-center
              shadow-[0_18px_50px_-40px_rgba(230,0,0,0.3)]
            "
          >
            <div
              className="
                mx-auto
                h-[3px]
                w-12
                rounded-full
                bg-brand
              "
            />

            <p
              className="
                mt-5
                font-display
                text-sm
                font-bold
                uppercase
                tracking-wider
                text-brand-deep
              "
            >
              No Blog Articles
            </p>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              No Blog articles are currently available.
            </p>
          </div>
        )}
      </div>

      {/* ===================================================
          BOTTOM RED DIVIDER
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-1/2
          h-px
          w-[80%]
          -translate-x-1/2
          bg-gradient-to-r
          from-transparent
          via-brand/15
          to-transparent
        "
      />
    </section>
  );
}