import type {
  Metadata,
} from "next";

import type {
  ReactNode,
} from "react";

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
   ALWAYS LOAD CURRENT BLOG DATA
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

type ArticleBlock =
  | {
      type: "h2";
      text: string;
    }
  | {
      type: "h3";
      text: string;
    }
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "bullet-list";
      items: string[];
    }
  | {
      type: "number-list";
      items: string[];
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
   METADATA
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

    openGraph: {
      title:
        post.title,

      description:
        post.excerpt,

      images:
        post.image
          ? [
              {
                url:
                  post.image,
              },
            ]
          : [],
    },
  };
}

/* =========================================================
   PAGE
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
     CONTENT

     Existing posts may have an empty content field.
     In that case we display their excerpt.
     ======================================================= */

  const articleText =
    post.content.trim() ||
    post.excerpt;

  const blocks =
    parseArticleContent(
      articleText
    );

  return (
    <main
      className="
        min-h-screen
        bg-white
        text-brand-deep
      "
    >
      {/* =====================================================
          TOP NAVIGATION
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
          {/* BACK */}

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
        <ArticleContent
          blocks={
            blocks
          }
        />

        {/* ===================================================
            ARTICLE END
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
   ARTICLE CONTENT
   ========================================================= */

function ArticleContent({
  blocks,
}: {
  blocks: ArticleBlock[];
}) {
  return (
    <div
      className="
        space-y-7
      "
    >
      {blocks.map(
        (
          block,
          index
        ) => {
          /* ===============================================
             HEADING 2
             =============================================== */

          if (
            block.type ===
            "h2"
          ) {
            return (
              <h2
                key={index}
                className="
                  pt-5
                  font-display
                  text-2xl
                  font-extrabold
                  leading-tight
                  text-brand-deep
                  md:text-3xl
                "
              >
                {renderInlineFormatting(
                  block.text
                )}
              </h2>
            );
          }

          /* ===============================================
             HEADING 3
             =============================================== */

          if (
            block.type ===
            "h3"
          ) {
            return (
              <h3
                key={index}
                className="
                  pt-3
                  font-display
                  text-xl
                  font-bold
                  leading-tight
                  text-brand-deep
                  md:text-2xl
                "
              >
                {renderInlineFormatting(
                  block.text
                )}
              </h3>
            );
          }

          /* ===============================================
             BULLET LIST
             =============================================== */

          if (
            block.type ===
            "bullet-list"
          ) {
            return (
              <ul
                key={index}
                className="
                  space-y-3
                  pl-1
                "
              >
                {block.items.map(
                  (
                    item,
                    itemIndex
                  ) => (
                    <li
                      key={
                        itemIndex
                      }
                      className="
                        flex
                        gap-3
                        text-base
                        leading-8
                        text-slate-600
                        md:text-lg
                      "
                    >
                      <span
                        className="
                          mt-[13px]
                          h-2
                          w-2
                          shrink-0
                          rounded-full
                          bg-brand
                        "
                      />

                      <span>
                        {renderInlineFormatting(
                          item
                        )}
                      </span>
                    </li>
                  )
                )}
              </ul>
            );
          }

          /* ===============================================
             NUMBERED LIST
             =============================================== */

          if (
            block.type ===
            "number-list"
          ) {
            return (
              <ol
                key={index}
                className="
                  space-y-3
                "
              >
                {block.items.map(
                  (
                    item,
                    itemIndex
                  ) => (
                    <li
                      key={
                        itemIndex
                      }
                      className="
                        flex
                        gap-4
                        text-base
                        leading-8
                        text-slate-600
                        md:text-lg
                      "
                    >
                      <span
                        className="
                          mt-1
                          grid
                          h-7
                          w-7
                          shrink-0
                          place-items-center
                          rounded-lg
                          bg-brand/[0.08]
                          text-xs
                          font-bold
                          text-brand
                        "
                      >
                        {itemIndex +
                          1}
                      </span>

                      <span>
                        {renderInlineFormatting(
                          item
                        )}
                      </span>
                    </li>
                  )
                )}
              </ol>
            );
          }

          /* ===============================================
             PARAGRAPH
             =============================================== */

          return (
            <p
              key={index}
              className="
                whitespace-pre-line
                text-base
                leading-8
                text-slate-600
                md:text-lg
              "
            >
              {renderInlineFormatting(
                block.text
              )}
            </p>
          );
        }
      )}
    </div>
  );
}

/* =========================================================
   PARSE ARTICLE CONTENT

   Supported syntax:

   ## Heading

   ### Subheading

   **bold text**

   - Bullet
   - Bullet

   1. Number
   2. Number
   ========================================================= */

function parseArticleContent(
  content: string
): ArticleBlock[] {
  const normalized =
    content.replace(
      /\r\n/g,
      "\n"
    );

  const lines =
    normalized.split(
      "\n"
    );

  const blocks:
    ArticleBlock[] =
    [];

  let paragraphLines:
    string[] =
    [];

  let bulletItems:
    string[] =
    [];

  let numberItems:
    string[] =
    [];

  /* =======================================================
     FLUSH PARAGRAPH
     ======================================================= */

  function flushParagraph() {
    if (
      paragraphLines.length ===
      0
    ) {
      return;
    }

    const text =
      paragraphLines
        .join("\n")
        .trim();

    if (text) {
      blocks.push({
        type:
          "paragraph",

        text,
      });
    }

    paragraphLines =
      [];
  }

  /* =======================================================
     FLUSH BULLETS
     ======================================================= */

  function flushBullets() {
    if (
      bulletItems.length ===
      0
    ) {
      return;
    }

    blocks.push({
      type:
        "bullet-list",

      items:
        bulletItems,
    });

    bulletItems =
      [];
  }

  /* =======================================================
     FLUSH NUMBERS
     ======================================================= */

  function flushNumbers() {
    if (
      numberItems.length ===
      0
    ) {
      return;
    }

    blocks.push({
      type:
        "number-list",

      items:
        numberItems,
    });

    numberItems =
      [];
  }

  /* =======================================================
     FLUSH EVERYTHING
     ======================================================= */

  function flushAll() {
    flushParagraph();
    flushBullets();
    flushNumbers();
  }

  /* =======================================================
     PARSE LINES
     ======================================================= */

  for (
    const rawLine
    of lines
  ) {
    const line =
      rawLine.trim();

    /* EMPTY LINE */

    if (!line) {
      flushAll();

      continue;
    }

    /* H3 */

    if (
      line.startsWith(
        "### "
      )
    ) {
      flushAll();

      blocks.push({
        type:
          "h3",

        text:
          line
            .slice(4)
            .trim(),
      });

      continue;
    }

    /* H2 */

    if (
      line.startsWith(
        "## "
      )
    ) {
      flushAll();

      blocks.push({
        type:
          "h2",

        text:
          line
            .slice(3)
            .trim(),
      });

      continue;
    }

    /* BULLET */

    if (
      /^-\s+/.test(
        line
      )
    ) {
      flushParagraph();
      flushNumbers();

      bulletItems.push(
        line.replace(
          /^-\s+/,
          ""
        )
      );

      continue;
    }

    /* NUMBER */

    if (
      /^\d+\.\s+/.test(
        line
      )
    ) {
      flushParagraph();
      flushBullets();

      numberItems.push(
        line.replace(
          /^\d+\.\s+/,
          ""
        )
      );

      continue;
    }

    /* NORMAL PARAGRAPH */

    flushBullets();
    flushNumbers();

    paragraphLines.push(
      rawLine.trim()
    );
  }

  flushAll();

  return blocks;
}

/* =========================================================
   INLINE FORMATTING

   Converts:

   **graphics card**

   into:

   <strong>graphics card</strong>

   We do NOT use dangerouslySetInnerHTML, so Admin content
   remains safely escaped by React.
   ========================================================= */

function renderInlineFormatting(
  text: string
): ReactNode[] {
  const parts =
    text.split(
      /(\*\*.+?\*\*)/g
    );

  return parts.map(
    (
      part,
      index
    ) => {
      if (
        part.startsWith(
          "**"
        ) &&
        part.endsWith(
          "**"
        ) &&
        part.length >
          4
      ) {
        return (
          <strong
            key={index}
            className="
              font-bold
              text-brand-deep
            "
          >
            {part.slice(
              2,
              -2
            )}
          </strong>
        );
      }

      return (
        <span
          key={index}
        >
          {part}
        </span>
      );
    }
  );
}