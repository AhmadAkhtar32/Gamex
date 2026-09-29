/* eslint-disable @next/next/no-img-element */

import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  asc,
  desc,
  eq,
} from "drizzle-orm";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
} from "lucide-react";

import {
  db,
} from "@/db";

import {
  blogPosts,
  blogSettings,
} from "@/db/schema";

/* =========================================================
   SITE
   ========================================================= */

const SITE_URL =
  "https://gamex.pk";

/* =========================================================
   ALWAYS LOAD CURRENT DATA
   ========================================================= */

export const dynamic =
  "force-dynamic";

/* =========================================================
   DEFAULT CONTENT
   ========================================================= */

const DEFAULT_BLOG_CONTENT = {
  eyebrow:
    "GameX Blog",

  title:
    "Gaming Guides & Hardware Insights",

  accent:
    "Hardware",

  subtitle:
    "Gaming PC build guides, hardware advice, component comparisons and performance insights from GameX Pakistan.",
};

/* =========================================================
   METADATA
   ========================================================= */

export const metadata: Metadata = {
  title:
    "Gaming PC Guides & Hardware Blog",

  description:
    "Read gaming PC build guides, graphics card advice, processor comparisons, hardware tips and gaming setup articles from GameX Pakistan.",

  alternates: {
    canonical:
      "/blog",
  },

  openGraph: {
    type:
      "website",

    locale:
      "en_PK",

    url:
      `${SITE_URL}/blog`,

    siteName:
      "GameX Pakistan",

    title:
      "Gaming PC Guides & Hardware Blog | GameX Pakistan",

    description:
      "Gaming PC build guides, graphics card advice, hardware comparisons and gaming setup tips from GameX Pakistan.",
  },

  twitter: {
    card:
      "summary",

    title:
      "Gaming PC Guides & Hardware Blog | GameX Pakistan",

    description:
      "Gaming PC build guides, hardware comparisons and gaming setup tips from GameX Pakistan.",
  },

  robots: {
    index:
      true,

    follow:
      true,

    googleBot: {
      index:
        true,

      follow:
        true,
    },
  },
};

/* =========================================================
   DATE
   ========================================================= */

function formatDate(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "en-PK",
    {
      day:
        "numeric",

      month:
        "long",

      year:
        "numeric",
    }
  ).format(
    date
  );
}

/* =========================================================
   TITLE WITH ACCENT
   ========================================================= */

function renderTitle(
  title: string,
  accent: string
) {
  if (
    !accent
  ) {
    return title;
  }

  const titleLower =
    title.toLowerCase();

  const accentLower =
    accent.toLowerCase();

  const index =
    titleLower.indexOf(
      accentLower
    );

  if (
    index ===
    -1
  ) {
    return title;
  }

  const before =
    title.slice(
      0,
      index
    );

  const highlighted =
    title.slice(
      index,
      index +
        accent.length
    );

  const after =
    title.slice(
      index +
        accent.length
    );

  return (
    <>
      {before}

      <span
        className="
          text-brand
        "
      >
        {
          highlighted
        }
      </span>

      {after}
    </>
  );
}

/* =========================================================
   PAGE
   ========================================================= */

export default async function BlogPage() {
  /* =======================================================
     SETTINGS
     ======================================================= */

  const settingsRows =
    await db
      .select({
        eyebrow:
          blogSettings.eyebrow,

        title:
          blogSettings.title,

        accent:
          blogSettings.accent,

        subtitle:
          blogSettings.subtitle,
      })
      .from(
        blogSettings
      )
      .where(
        eq(
          blogSettings.id,
          "main"
        )
      )
      .limit(
        1
      );

  const content =
    settingsRows[0] ??
    DEFAULT_BLOG_CONTENT;

  /* =======================================================
     POSTS
     ======================================================= */

  const posts =
    await db
      .select({
        id:
          blogPosts.id,

        title:
          blogPosts.title,

        slug:
          blogPosts.slug,

        category:
          blogPosts.category,

        excerpt:
          blogPosts.excerpt,

        image:
          blogPosts.image,

        readTime:
          blogPosts.readTime,

        publishedAt:
          blogPosts.publishedAt,

        updatedAt:
          blogPosts.updatedAt,
      })
      .from(
        blogPosts
      )
      .where(
        eq(
          blogPosts.isVisible,
          true
        )
      )
      .orderBy(
        asc(
          blogPosts.sortOrder
        ),

        desc(
          blogPosts.publishedAt
        ),

        asc(
          blogPosts.id
        )
      );

  /* =======================================================
     STRUCTURED DATA
     ======================================================= */

  const structuredData = {
    "@context":
      "https://schema.org",

    "@type":
      "CollectionPage",

    "@id":
      `${SITE_URL}/blog#collection`,

    url:
      `${SITE_URL}/blog`,

    name:
      "GameX Pakistan Gaming Blog",

    description:
      "Gaming PC build guides, hardware advice and gaming setup articles from GameX Pakistan.",

    isPartOf: {
      "@type":
        "WebSite",

      "@id":
        `${SITE_URL}/#website`,
    },

    mainEntity: {
      "@type":
        "ItemList",

      numberOfItems:
        posts.length,

      itemListElement:
        posts.map(
          (
            post,
            index
          ) => ({
            "@type":
              "ListItem",

            position:
              index + 1,

            name:
              post.title,

            url:
              `${SITE_URL}/blog/${post.slug}`,
          })
        ),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              structuredData
            ),
        }}
      />

      <main
        className="
          min-h-screen
          bg-[#fff8f8]
        "
      >
        {/* ===================================================
            HERO
            =================================================== */}

        <section
          className="
            relative
            overflow-hidden
            border-b
            border-brand/10
            bg-white
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-48
              -top-52
              h-[36rem]
              w-[36rem]
              rounded-full
              bg-brand/[0.08]
              blur-[150px]
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -bottom-52
              -left-48
              h-[30rem]
              w-[30rem]
              rounded-full
              bg-brand/[0.05]
              blur-[140px]
            "
          />

          <div
            className="
              relative
              mx-auto
              max-w-7xl
              px-5
              py-14
              md:px-8
              md:py-20
            "
          >
            <Link
              href="/"
              className="
                inline-flex
                items-center
                gap-2
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-brand
                transition-colors
                hover:text-brand-soft
              "
            >
              <ArrowLeft className="h-4 w-4" />

              Back Home
            </Link>

            <p
              className="
                mt-10
                text-xs
                font-extrabold
                uppercase
                tracking-[0.24em]
                text-brand
              "
            >
              {
                content.eyebrow
              }
            </p>

            <h1
              className="
                mt-3
                max-w-5xl
                font-display
                text-4xl
                font-extrabold
                uppercase
                leading-tight
                text-brand-deep
                md:text-6xl
              "
            >
              {renderTitle(
                content.title,
                content.accent
              )}
            </h1>

            <p
              className="
                mt-5
                max-w-3xl
                text-sm
                leading-7
                text-slate-600
                md:text-base
              "
            >
              {
                content.subtitle
              }
            </p>

            <div
              className="
                mt-6
                inline-flex
                rounded-xl
                border
                border-brand/10
                bg-[#fff8f8]
                px-4
                py-2.5
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-slate-600
              "
            >
              {
                posts.length
              }{" "}

              {posts.length ===
              1
                ? "Article"
                : "Articles"}
            </div>
          </div>
        </section>

        {/* ===================================================
            ARTICLES
            =================================================== */}

        <section
          className="
            mx-auto
            max-w-7xl
            px-5
            py-12
            md:px-8
            md:py-16
          "
        >
          {posts.length >
          0 ? (
            <div
              className="
                grid
                gap-6
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {posts.map(
                (
                  post
                ) => (
                  <article
                    key={
                      post.id
                    }
                    className="
                      group
                      flex
                      h-full
                      flex-col
                      overflow-hidden
                      rounded-2xl
                      border
                      border-black/[0.07]
                      bg-white
                      shadow-[0_20px_60px_-42px_rgba(0,0,0,0.28)]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-brand/25
                      hover:shadow-[0_26px_65px_-42px_rgba(230,0,0,0.28)]
                    "
                  >
                    {/* IMAGE */}

                    <Link
                      href={`/blog/${post.slug}`}
                      className="
                        relative
                        block
                        aspect-[16/9]
                        overflow-hidden
                        bg-[#f4f4f4]
                      "
                    >
                      <img
                        src={
                          post.image
                        }
                        alt={`${post.title} - GameX Pakistan`}
                        loading="lazy"
                        className="
                          h-full
                          w-full
                          object-cover
                          object-center
                          transition-transform
                          duration-500
                          group-hover:scale-[1.04]
                        "
                      />

                      <div
                        aria-hidden="true"
                        className="
                          pointer-events-none
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/20
                          via-transparent
                          to-transparent
                        "
                      />

                      <span
                        className="
                          absolute
                          left-4
                          top-4
                          rounded-full
                          bg-brand
                          px-3
                          py-1.5
                          text-[10px]
                          font-extrabold
                          uppercase
                          tracking-wider
                          text-white
                        "
                      >
                        {
                          post.category
                        }
                      </span>
                    </Link>

                    {/* CONTENT */}

                    <div
                      className="
                        flex
                        flex-1
                        flex-col
                        p-5
                      "
                    >
                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-x-4
                          gap-y-2
                          text-[11px]
                          font-semibold
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

                          {formatDate(
                            post.publishedAt
                          )}
                        </span>

                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                          "
                        >
                          <Clock3 className="h-3.5 w-3.5 text-brand" />

                          {
                            post.readTime
                          }
                        </span>
                      </div>

                      <h2
                        className="
                          mt-4
                          font-display
                          text-xl
                          font-extrabold
                          leading-snug
                          text-brand-deep
                          transition-colors
                          group-hover:text-brand
                        "
                      >
                        <Link
                          href={`/blog/${post.slug}`}
                        >
                          {
                            post.title
                          }
                        </Link>
                      </h2>

                      <p
                        className="
                          mt-3
                          line-clamp-3
                          text-sm
                          leading-7
                          text-slate-600
                        "
                      >
                        {
                          post.excerpt
                        }
                      </p>

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
                            rounded-xl
                            border
                            border-brand/15
                            bg-[#fff8f8]
                            px-4
                            py-3
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-brand-deep
                            transition-all
                            hover:border-brand
                            hover:bg-brand
                            hover:text-white
                          "
                        >
                          Read Article

                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-brand/20
                bg-white
                px-6
                py-16
                text-center
              "
            >
              <div
                className="
                  mx-auto
                  h-1
                  w-14
                  rounded-full
                  bg-brand
                "
              />

              <h2
                className="
                  mt-5
                  font-display
                  text-2xl
                  font-extrabold
                  uppercase
                  text-brand-deep
                "
              >
                Articles Coming Soon
              </h2>

              <p
                className="
                  mx-auto
                  mt-3
                  max-w-xl
                  text-sm
                  leading-7
                  text-slate-500
                "
              >
                GameX is preparing gaming PC guides, hardware
                advice and performance articles for gamers in
                Pakistan.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}