/* eslint-disable @next/next/no-img-element */

import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  and,
  eq,
} from "drizzle-orm";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
} from "lucide-react";

import {
  notFound,
} from "next/navigation";

import {
  db,
} from "@/db";

import {
  blogPosts,
} from "@/db/schema";

/* =========================================================
   SITE
   ========================================================= */

const SITE_URL =
  "https://gamex.pk";

/* =========================================================
   TYPES
   ========================================================= */

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/* =========================================================
   DATE FORMATTER
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
   GET POST
   ========================================================= */

async function getPost(
  slug: string
) {
  const rows =
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

        content:
          blogPosts.content,

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
      .limit(
        1
      );

  return rows[0] ??
    null;
}

/* =========================================================
   METADATA
   ========================================================= */

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const {
    slug,
  } =
    await params;

  const post =
    await getPost(
      slug
    );

  if (
    !post
  ) {
    return {
      title:
        "Article Not Found",

      robots: {
        index:
          false,

        follow:
          false,
      },
    };
  }

  const canonical =
    `/blog/${post.slug}`;

  return {
    title:
      post.title,

    description:
      post.excerpt,

    alternates: {
      canonical,
    },

    openGraph: {
      type:
        "article",

      locale:
        "en_PK",

      url:
        `${SITE_URL}${canonical}`,

      siteName:
        "GameX Pakistan",

      title:
        post.title,

      description:
        post.excerpt,

      publishedTime:
        post.publishedAt.toISOString(),

      modifiedTime:
        post.updatedAt.toISOString(),

      section:
        post.category,

      images: [
        {
          url:
            post.image,

          alt:
            `${post.title} - GameX Pakistan`,
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        post.title,

      description:
        post.excerpt,

      images: [
        post.image,
      ],
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

        "max-image-preview":
          "large",
      },
    },
  };
}

/* =========================================================
   PAGE
   ========================================================= */

export default async function BlogPostPage({
  params,
}: BlogPostPageProps) {
  const {
    slug,
  } =
    await params;

  const post =
    await getPost(
      slug
    );

  if (
    !post
  ) {
    notFound();
  }

  const postUrl =
    `${SITE_URL}/blog/${post.slug}`;

  /* =======================================================
     ARTICLE STRUCTURED DATA
     ======================================================= */

  const articleStructuredData = {
    "@context":
      "https://schema.org",

    "@type":
      "BlogPosting",

    "@id":
      `${postUrl}#article`,

    url:
      postUrl,

    mainEntityOfPage: {
      "@type":
        "WebPage",

      "@id":
        postUrl,
    },

    headline:
      post.title,

    description:
      post.excerpt,

    image: [
      post.image,
    ],

    articleSection:
      post.category,

    datePublished:
      post.publishedAt.toISOString(),

    dateModified:
      post.updatedAt.toISOString(),

    author: {
      "@type":
        "Organization",

      name:
        "GameX",

      url:
        SITE_URL,
    },

    publisher: {
      "@type":
        "Organization",

      name:
        "GameX",

      url:
        SITE_URL,
    },
  };

  /* =======================================================
     BREADCRUMB STRUCTURED DATA
     ======================================================= */

  const breadcrumbStructuredData = {
    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    itemListElement: [
      {
        "@type":
          "ListItem",

        position:
          1,

        name:
          "Home",

        item:
          SITE_URL,
      },

      {
        "@type":
          "ListItem",

        position:
          2,

        name:
          "Blog",

        item:
          `${SITE_URL}/#blog`,
      },

      {
        "@type":
          "ListItem",

        position:
          3,

        name:
          post.title,

        item:
          postUrl,
      },
    ],
  };

  /* =======================================================
     CONTENT PARAGRAPHS
     ======================================================= */

  const paragraphs =
    post.content
      .split(
        /\n{2,}/
      )
      .map(
        (
          paragraph
        ) =>
          paragraph.trim()
      )
      .filter(
        Boolean
      );

  return (
    <>
      {/* =====================================================
          STRUCTURED DATA
          ===================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              articleStructuredData
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              breadcrumbStructuredData
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
            BREADCRUMB
            =================================================== */}

        <section
          className="
            border-b
            border-brand/10
            bg-white
          "
        >
          <div
            className="
              mx-auto
              max-w-5xl
              px-5
              py-6
              md:px-8
            "
          >
            <nav
              aria-label="Breadcrumb"
              className="
                flex
                flex-wrap
                items-center
                gap-2
                text-xs
                font-semibold
                text-slate-500
              "
            >
              <Link
                href="/"
                className="
                  transition-colors
                  hover:text-brand
                "
              >
                Home
              </Link>

              <span>
                /
              </span>

              <Link
                href="/#blog"
                className="
                  transition-colors
                  hover:text-brand
                "
              >
                Blog
              </Link>

              <span>
                /
              </span>

              <span
                className="
                  text-brand
                "
              >
                {
                  post.category
                }
              </span>
            </nav>
          </div>
        </section>

        {/* ===================================================
            ARTICLE HEADER
            =================================================== */}

        <article>
          <header
            className="
              bg-white
            "
          >
            <div
              className="
                mx-auto
                max-w-5xl
                px-5
                pb-10
                pt-12
                md:px-8
                md:pb-14
                md:pt-16
              "
            >
              <Link
                href="/#blog"
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

                Back to Blog
              </Link>

              <p
                className="
                  mt-8
                  text-xs
                  font-extrabold
                  uppercase
                  tracking-[0.22em]
                  text-brand
                "
              >
                {
                  post.category
                }
              </p>

              <h1
                className="
                  mt-3
                  max-w-4xl
                  font-display
                  text-3xl
                  font-extrabold
                  leading-tight
                  text-brand-deep
                  md:text-5xl
                "
              >
                {
                  post.title
                }
              </h1>

              <p
                className="
                  mt-5
                  max-w-3xl
                  text-base
                  leading-8
                  text-slate-600
                  md:text-lg
                "
              >
                {
                  post.excerpt
                }
              </p>

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  items-center
                  gap-4
                  text-xs
                  font-semibold
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
                  <CalendarDays className="h-4 w-4 text-brand" />

                  {formatDate(
                    post.publishedAt
                  )}
                </span>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                  "
                >
                  <Clock3 className="h-4 w-4 text-brand" />

                  {
                    post.readTime
                  }
                </span>
              </div>
            </div>
          </header>

          {/* =================================================
              FEATURE IMAGE
              ================================================= */}

          <div
            className="
              mx-auto
              max-w-6xl
              px-5
              pt-8
              md:px-8
            "
          >
            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-black/[0.07]
                bg-white
                p-3
                shadow-[0_25px_70px_-45px_rgba(0,0,0,0.3)]
                md:p-4
              "
            >
              <div
                className="
                  relative
                  aspect-[16/9]
                  overflow-hidden
                  rounded-2xl
                  bg-[#f4f4f4]
                "
              >
                <img
                  src={
                    post.image
                  }
                  alt={`${post.title} - GameX Pakistan`}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    object-center
                  "
                />
              </div>
            </div>
          </div>

          {/* =================================================
              ARTICLE BODY
              ================================================= */}

          <div
            className="
              mx-auto
              max-w-4xl
              px-5
              py-12
              md:px-8
              md:py-16
            "
          >
            <div
              className="
                rounded-3xl
                border
                border-brand/10
                bg-white
                p-6
                shadow-[0_25px_70px_-55px_rgba(0,0,0,0.3)]
                md:p-10
              "
            >
              {paragraphs.length >
              0 ? (
                <div
                  className="
                    space-y-6
                  "
                >
                  {paragraphs.map(
                    (
                      paragraph,
                      index
                    ) => (
                      <p
                        key={
                          index
                        }
                        className="
                          whitespace-pre-line
                          text-[15px]
                          leading-8
                          text-slate-700
                          md:text-base
                        "
                      >
                        {
                          paragraph
                        }
                      </p>
                    )
                  )}
                </div>
              ) : (
                <p
                  className="
                    text-sm
                    leading-7
                    text-slate-500
                  "
                >
                  This article is being updated. Please check
                  back soon for the complete guide.
                </p>
              )}
            </div>

            {/* ===============================================
                FOOTER CTA
                =============================================== */}

            <div
              className="
                mt-8
                rounded-3xl
                bg-brand
                p-6
                text-white
                md:p-8
              "
            >
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-white/65
                "
              >
                GameX Pakistan
              </p>

              <h2
                className="
                  mt-2
                  font-display
                  text-2xl
                  font-extrabold
                  uppercase
                "
              >
                Build Your Gaming Setup
              </h2>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-sm
                  leading-7
                  text-white/80
                "
              >
                Browse GameX gaming PC components, custom
                gaming builds and accessories for your next
                setup.
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
                    rounded-xl
                    bg-white
                    px-5
                    py-3
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-brand
                    transition-transform
                    hover:-translate-y-0.5
                  "
                >
                  View Products
                </Link>

                <Link
                  href="/#builds"
                  className="
                    rounded-xl
                    border
                    border-white/25
                    px-5
                    py-3
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-white
                    transition-colors
                    hover:bg-white/10
                  "
                >
                  Custom Builds
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}