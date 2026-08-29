import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Home,
} from "lucide-react";

import {
  and,
  eq,
} from "drizzle-orm";

import {
  notFound,
} from "next/navigation";

import { db } from "@/db";

import {
  blogPosts,
} from "@/db/schema";

/* =========================================================
   ALWAYS USE CURRENT DATABASE CONTENT
   ========================================================= */

export const dynamic =
  "force-dynamic";

/* =========================================================
   TYPES
   ========================================================= */

type BlogArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/* =========================================================
   GET BLOG POST
   ========================================================= */

async function getBlogPost(
  slug: string
) {
  const rows =
    await db
      .select()
      .from(
        blogPosts
      )
      .where(
        and(
          eq(
            blogPosts.slug,
            slug
          ),
          eq(
            blogPosts.isVisible,
            true
          )
        )
      )
      .limit(1);

  return rows[0] ?? null;
}

/* =========================================================
   PAGE METADATA
   ========================================================= */

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const {
    slug,
  } = await params;

  const post =
    await getBlogPost(
      slug
    );

  if (!post) {
    return {
      title:
        "Article Not Found | Gamex",
    };
  }

  return {
    title:
      `${post.title} | Gamex`,

    description:
      post.excerpt,
  };
}

/* =========================================================
   BLOG ARTICLE PAGE
   ========================================================= */

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const {
    slug,
  } = await params;

  const post =
    await getBlogPost(
      slug
    );

  if (!post) {
    notFound();
  }

  /* =======================================================
     DATE
     ======================================================= */

  const publishedDate =
    new Intl.DateTimeFormat(
      "en-US",
      {
        month:
          "long",

        day:
          "numeric",

        year:
          "numeric",
      }
    ).format(
      post.publishedAt
    );

  /* =======================================================
     ARTICLE CONTENT

     Old posts may not yet have full content because the
     content column was added after those posts existed.

     In that case we use the excerpt rather than displaying
     a completely empty article.
     ======================================================= */

  const articleText =
    post.content.trim() ||
    post.excerpt;

  /*
   * Separate the article into paragraphs whenever the admin
   * enters an empty line.
   */

  const contentBlocks =
    articleText
      .split(
        /\n{2,}/
      )
      .map(
        (block) =>
          block.trim()
      )
      .filter(Boolean);

  return (
    <main
      className="
        min-h-screen
        bg-white
        text-brand-deep
      "
    >
      {/* =====================================================
          TOP BAR
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
              rounded-lg
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
            <Home className="h-4 w-4" />

            Home
          </Link>
        </div>
      </header>

      {/* =====================================================
          ARTICLE HERO
          ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          border-b
          border-brand/10
          bg-[#f7f9fc]
        "
      >
        {/* DECORATION */}

        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-40
            h-[30rem]
            w-[30rem]
            rounded-full
            bg-brand/10
            blur-[130px]
          "
        />

        <div
          className="
            relative
            mx-auto
            max-w-5xl
            px-5
            pb-14
            pt-12
            md:px-8
            md:pb-20
            md:pt-16
          "
        >
          {/* BACK TO BLOG */}

          <Link
            href="/#blog"
            className="
              inline-flex
              items-center
              gap-2
              text-xs
              font-bold
              uppercase
              tracking-[0.18em]
              text-brand
              transition-colors
              hover:text-brand-soft
            "
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Blog
          </Link>

          {/* CATEGORY */}

          <div className="mt-8">
            <span
              className="
                inline-flex
                rounded-full
                bg-brand
                px-4
                py-1.5
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-white
              "
            >
              {post.category}
            </span>
          </div>

          {/* TITLE */}

          <h1
            className="
              mt-6
              max-w-4xl
              font-display
              text-4xl
              font-black
              leading-[1.08]
              tracking-tight
              text-brand-deep
              sm:text-5xl
              lg:text-6xl
            "
          >
            {post.title}
          </h1>

          {/* EXCERPT */}

          <p
            className="
              mt-6
              max-w-3xl
              text-lg
              leading-relaxed
              text-slate-600
              md:text-xl
            "
          >
            {post.excerpt}
          </p>

          {/* META */}

          <div
            className="
              mt-7
              flex
              flex-wrap
              items-center
              gap-x-6
              gap-y-3
              text-sm
              text-slate-500
            "
          >
            <span
              className="
                inline-flex
                items-center
                gap-2
              "
            >
              <CalendarDays
                className="
                  h-4
                  w-4
                  text-brand
                "
              />

              {publishedDate}
            </span>

            <span
              className="
                inline-flex
                items-center
                gap-2
              "
            >
              <Clock
                className="
                  h-4
                  w-4
                  text-brand
                "
              />

              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED IMAGE
          ===================================================== */}

      <section
        className="
          mx-auto
          max-w-6xl
          px-5
          pt-10
          md:px-8
          md:pt-14
        "
      >
        <div
          className="
            relative
            aspect-[16/8]
            overflow-hidden
            rounded-2xl
            border
            border-brand/10
            bg-slate-100
            shadow-[0_30px_80px_-45px_rgba(23,49,96,0.45)]
          "
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.title}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-brand-deep/10
              to-transparent
            "
          />
        </div>
      </section>

      {/* =====================================================
          ARTICLE BODY
          ===================================================== */}

      <article
        className="
          mx-auto
          max-w-3xl
          px-5
          py-14
          md:px-8
          md:py-20
        "
      >
        <div
          className="
            space-y-7
          "
        >
          {contentBlocks.map(
            (
              block,
              index
            ) => (
              <ArticleBlock
                key={index}
                text={block}
              />
            )
          )}
        </div>

        {/* ===================================================
            END DIVIDER
            =================================================== */}

        <div
          className="
            mt-16
            border-t
            border-brand/10
            pt-8
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
            Gamex Blog
          </p>

          <h2
            className="
              mt-2
              font-display
              text-2xl
              font-extrabold
              text-brand-deep
            "
          >
            Ready to build your next rig?
          </h2>

          <p
            className="
              mt-3
              max-w-xl
              text-sm
              leading-relaxed
              text-slate-500
            "
          >
            Explore Gamex hardware and custom builds, or get
            in touch with the team for help planning your
            gaming setup.
          </p>

          <div
            className="
              mt-6
              flex
              flex-wrap
              gap-3
            "
          >
            <Link
              href="/#products"
              className="
                inline-flex
                items-center
                justify-center
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
                hover:-translate-y-0.5
                hover:bg-brand-soft
              "
            >
              Explore Hardware
            </Link>

            <Link
              href="/#contact"
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                border
                border-brand/20
                bg-white
                px-5
                py-3
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
      </article>

      {/* =====================================================
          SIMPLE FOOTER
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
   ARTICLE BLOCK

   This provides a little intelligent formatting while the
   Blog editor is still plain text.

   Example:

   1. Choose the right processor

   becomes a heading automatically.
   ========================================================= */

function ArticleBlock({
  text,
}: {
  text: string;
}) {
  const lines =
    text.split("\n");

  const firstLine =
    lines[0]?.trim() ??
    "";

  const rest =
    lines
      .slice(1)
      .join("\n")
      .trim();

  /*
   * Detect headings such as:
   *
   * 1. Choose the right CPU
   * 2. Pick your GPU
   */

  const numberedHeading =
    /^\d+\.\s+/.test(
      firstLine
    );

  /*
   * Detect Markdown-style headings:
   *
   * ## Cooling
   */

  const markdownHeading =
    /^#{1,3}\s+/.test(
      firstLine
    );

  if (
    numberedHeading ||
    markdownHeading
  ) {
    const cleanHeading =
      firstLine.replace(
        /^#{1,3}\s+/,
        ""
      );

    return (
      <section>
        <h2
          className="
            font-display
            text-2xl
            font-extrabold
            leading-tight
            text-brand-deep
            md:text-3xl
          "
        >
          {cleanHeading}
        </h2>

        {rest ? (
          <p
            className="
              mt-4
              whitespace-pre-line
              text-base
              leading-8
              text-slate-600
              md:text-lg
            "
          >
            {rest}
          </p>
        ) : null}
      </section>
    );
  }

  return (
    <p
      className="
        whitespace-pre-line
        text-base
        leading-8
        text-slate-600
        md:text-lg
      "
    >
      {text}
    </p>
  );
}