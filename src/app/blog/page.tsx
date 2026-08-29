import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock,
} from "lucide-react";

import {
  getBlogHomepageData,
} from "@/lib/blog";

/* =========================================================
   METADATA
   ========================================================= */

export const metadata: Metadata = {
  title: "Blog | Gamex",
  description:
    "Gamex gaming PC build guides, hardware advice, benchmarks, cooling tips and performance insights.",
};

/* =========================================================
   ALWAYS LOAD CURRENT DATABASE DATA
   ========================================================= */

export const dynamic =
  "force-dynamic";

/* =========================================================
   BLOG PAGE
   ========================================================= */

export default async function BlogPage() {
  const {
    content,
    posts,
  } =
    await getBlogHomepageData();

  return (
    <main
      className="
        min-h-screen
        bg-[#fbfcfe]
        text-brand-deep
      "
    >
      {/* =====================================================
          HEADER
          ===================================================== */}

      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-brand/10
          bg-white/95
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            gap-4
            px-5
            py-4
            md:px-8
          "
        >
          {/* BRAND */}

          <Link
            href="/"
            className="
              font-display
              text-xl
              font-black
              uppercase
              tracking-[0.16em]
              text-brand-deep
            "
          >
            GAME
            <span className="text-brand">
              X
            </span>
          </Link>

          {/* HOME */}

          <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-brand/15
              bg-white
              px-4
              py-2.5
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-brand
              transition-all
              hover:border-brand
              hover:bg-brand
              hover:text-white
            "
          >
            <ArrowLeft className="h-4 w-4" />

            Back Home
          </Link>
        </div>
      </header>

      {/* =====================================================
          HERO
          ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          border-b
          border-brand/10
          bg-white
        "
      >
        {/* BACKGROUND */}

        <div
          className="
            pointer-events-none
            absolute
            -right-40
            -top-48
            h-[34rem]
            w-[34rem]
            rounded-full
            bg-brand/10
            blur-[140px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-48
            -left-40
            h-[28rem]
            w-[28rem]
            rounded-full
            bg-brand/5
            blur-[130px]
          "
        />

        <div
          className="
            relative
            mx-auto
            max-w-7xl
            px-5
            py-20
            text-center
            md:px-8
            md:py-28
          "
        >
          {/* EYEBROW */}

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-brand/20
              bg-brand/[0.06]
              px-4
              py-1.5
              text-xs
              font-bold
              uppercase
              tracking-[0.24em]
              text-brand
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-brand
              "
            />

            {content.eyebrow}
          </div>

          {/* TITLE */}

          <h1
            className="
              mx-auto
              mt-6
              max-w-4xl
              font-display
              text-4xl
              font-black
              uppercase
              leading-[1.05]
              tracking-tight
              text-brand-deep
              sm:text-5xl
              md:text-6xl
              lg:text-7xl
            "
          >
            {renderTitle(
              content.title,
              content.accent
            )}
          </h1>

          {/* SUBTITLE */}

          <p
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-base
              leading-relaxed
              text-slate-600
              md:text-lg
            "
          >
            {content.subtitle}
          </p>

          {/* ARTICLE COUNT */}

          <div
            className="
              mt-7
              text-xs
              font-bold
              uppercase
              tracking-[0.18em]
              text-slate-400
            "
          >
            {posts.length}{" "}
            {posts.length === 1
              ? "Article"
              : "Articles"}
          </div>
        </div>
      </section>

      {/* =====================================================
          ARTICLES
          ===================================================== */}

      <section
        className="
          mx-auto
          max-w-7xl
          px-5
          py-16
          md:px-8
          md:py-24
        "
      >
        {posts.length > 0 ? (
          <div
            className="
              grid
              gap-7
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {posts.map(
              (post) => (
                <article
                  key={post.id}
                  className="
                    group
                    flex
                    h-full
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-brand/10
                    bg-white
                    shadow-[0_20px_60px_-42px_rgba(23,49,96,0.35)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-brand/25
                    hover:shadow-[0_28px_70px_-42px_rgba(23,49,96,0.45)]
                  "
                >
                  {/* =========================================
                      IMAGE
                      ========================================= */}

                  <Link
                    href={`/blog/${post.slug}`}
                    className="
                      relative
                      block
                      aspect-[16/10]
                      overflow-hidden
                      bg-slate-100
                    "
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        ease-out
                        group-hover:scale-105
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-brand-deep/20
                        via-transparent
                        to-transparent
                      "
                    />

                    {/* CATEGORY */}

                    <span
                      className="
                        absolute
                        left-4
                        top-4
                        rounded-lg
                        bg-brand
                        px-3
                        py-1.5
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.15em]
                        text-white
                        shadow-lg
                      "
                    >
                      {post.category}
                    </span>
                  </Link>

                  {/* =========================================
                      CONTENT
                      ========================================= */}

                  <div
                    className="
                      flex
                      flex-1
                      flex-col
                      p-6
                    "
                  >
                    {/* META */}

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-x-4
                        gap-y-2
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-400
                      "
                    >
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                        "
                      >
                        <CalendarDays className="h-3.5 w-3.5" />

                        {post.date}
                      </span>

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                        "
                      >
                        <Clock className="h-3.5 w-3.5" />

                        {post.readTime}
                      </span>
                    </div>

                    {/* TITLE */}

                    <Link
                      href={`/blog/${post.slug}`}
                      className="
                        mt-4
                        block
                      "
                    >
                      <h2
                        className="
                          font-display
                          text-xl
                          font-extrabold
                          leading-snug
                          text-brand-deep
                          transition-colors
                          group-hover:text-brand
                        "
                      >
                        {post.title}
                      </h2>
                    </Link>

                    {/* EXCERPT */}

                    <p
                      className="
                        mt-3
                        text-sm
                        leading-7
                        text-slate-600
                      "
                    >
                      {post.excerpt}
                    </p>

                    {/* READ MORE */}

                    <Link
                      href={`/blog/${post.slug}`}
                      className="
                        mt-auto
                        inline-flex
                        items-center
                        gap-2
                        pt-6
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.15em]
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
                          group-hover:translate-x-1
                          group-hover:-translate-y-1
                        "
                      />
                    </Link>
                  </div>
                </article>
              )
            )}
          </div>
        ) : (
          /* =================================================
             EMPTY BLOG
             ================================================= */

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-brand/20
              bg-white
              px-6
              py-20
              text-center
            "
          >
            <p
              className="
                font-display
                text-2xl
                font-extrabold
                uppercase
                text-brand-deep
              "
            >
              No Articles Yet
            </p>

            <p
              className="
                mx-auto
                mt-3
                max-w-lg
                text-sm
                leading-relaxed
                text-slate-500
              "
            >
              There are currently no published Gamex Blog
              articles. Check back soon for new build guides,
              hardware advice and gaming insights.
            </p>

            <Link
              href="/"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-brand
                px-5
                py-3
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-white
                transition-all
                hover:bg-brand-soft
              "
            >
              <ArrowLeft className="h-4 w-4" />

              Return Home
            </Link>
          </div>
        )}
      </section>

      {/* =====================================================
          CTA
          ===================================================== */}

      <section
        className="
          border-t
          border-brand/10
          bg-white
        "
      >
        <div
          className="
            mx-auto
            max-w-4xl
            px-5
            py-16
            text-center
            md:px-8
            md:py-20
          "
        >
          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.22em]
              text-brand
            "
          >
            Build With Gamex
          </p>

          <h2
            className="
              mt-3
              font-display
              text-3xl
              font-black
              uppercase
              text-brand-deep
              md:text-4xl
            "
          >
            Ready for your next gaming rig?
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-xl
              text-sm
              leading-relaxed
              text-slate-500
            "
          >
            Explore our gaming hardware and custom systems or
            contact the Gamex team to plan your next build.
          </p>

          <div
            className="
              mt-7
              flex
              flex-wrap
              justify-center
              gap-3
            "
          >
            <Link
              href="/#products"
              className="
                rounded-xl
                bg-brand
                px-6
                py-3.5
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-white
                transition-all
                hover:-translate-y-0.5
                hover:bg-brand-soft
              "
            >
              Explore Products
            </Link>

            <Link
              href="/#contact"
              className="
                rounded-xl
                border
                border-brand/20
                bg-white
                px-6
                py-3.5
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-brand
                transition-all
                hover:border-brand
                hover:bg-brand/[0.04]
              "
            >
              Contact Gamex
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer
        className="
          border-t
          border-brand/10
          bg-[#f7f9fc]
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            gap-3
            px-5
            py-8
            text-center
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:text-left
            md:px-8
          "
        >
          <Link
            href="/"
            className="
              font-display
              text-lg
              font-black
              uppercase
              tracking-[0.15em]
              text-brand-deep
            "
          >
            GAME
            <span className="text-brand">
              X
            </span>
          </Link>

          <p
            className="
              text-xs
              text-slate-400
            "
          >
            Premium gaming hardware built to win.
          </p>
        </div>
      </footer>
    </main>
  );
}

/* =========================================================
   TITLE ACCENT

   Example:

   title  = Intel from the bench
   accent = bench

   Result:
   "bench" is rendered in the Gamex brand blue.
   ========================================================= */

function renderTitle(
  title: string,
  accent: string
) {
  if (!accent.trim()) {
    return title;
  }

  const words =
    title.split(" ");

  const normalizedAccent =
    accent
      .trim()
      .toLowerCase();

  return words.map(
    (
      word,
      index
    ) => {
      const cleanWord =
        word
          .replace(
            /[.,!?;:]/g,
            ""
          )
          .toLowerCase();

      const highlighted =
        cleanWord ===
        normalizedAccent;

      return (
        <span
          key={`${word}-${index}`}
        >
          <span
            className={
              highlighted
                ? "text-brand"
                : undefined
            }
          >
            {word}
          </span>

          {index <
          words.length - 1
            ? " "
            : null}
        </span>
      );
    }
  );
}