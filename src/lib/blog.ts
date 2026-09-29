import {
  asc,
  desc,
  eq,
} from "drizzle-orm";

import { db } from "@/db";

import {
  blogPosts,
  blogSettings,
} from "@/db/schema";

import {
  seedBlogPosts,
} from "@/lib/data";

/* =========================================================
   PUBLIC TYPES
   ========================================================= */

export type BlogSectionContent = {
  eyebrow: string;
  title: string;
  accent: string;
  subtitle: string;
  readMoreText: string;
  isVisible: boolean;
};

export type PublicBlogPost = {
  id: number | string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  image: string;
  readTime: string;
  date: string;
};

/* =========================================================
   DEFAULT BLOG SETTINGS
   ========================================================= */

export const DEFAULT_BLOG_CONTENT: BlogSectionContent = {
  eyebrow:
    "The Gamex Blog",

  title:
    "Intel from the bench",

  accent:
    "bench",

  subtitle:
    "Build guides, benchmarks and hardware breakdowns from the Gamex engineering team.",

  readMoreText:
    "Read Story",

  isVisible:
    true,
};

/* =========================================================
   DEFAULT BLOG POSTS

   Kept for backwards compatibility with the Blog component.

   Public homepage data now uses Neon as the authoritative
   source so every displayed article has a real /blog/[slug]
   route.
   ========================================================= */

export const DEFAULT_BLOG_POSTS: PublicBlogPost[] =
  seedBlogPosts.map(
    (post) => ({
      id:
        post.id,

      title:
        post.title,

      slug:
        post.slug,

      category:
        post.category,

      excerpt:
        post.excerpt,

      image:
        post.image,

      readTime:
        post.readTime,

      date:
        formatBlogDate(
          new Date(
            post.date
          )
        ),
    })
  );

/* =========================================================
   DATE FORMATTER
   ========================================================= */

function formatBlogDate(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month:
        "short",

      day:
        "numeric",

      year:
        "numeric",
    }
  ).format(
    date
  );
}

/* =========================================================
   GET BLOG HOMEPAGE DATA
   ========================================================= */

export async function getBlogHomepageData(): Promise<{
  content: BlogSectionContent;
  posts: PublicBlogPost[];
}> {
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

        readMoreText:
          blogSettings.readMoreText,

        isVisible:
          blogSettings.isVisible,
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
     VISIBLE DATABASE POSTS
     ======================================================= */

  const databasePosts =
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

  const formattedPosts: PublicBlogPost[] =
    databasePosts.map(
      (
        post
      ) => ({
        id:
          post.id,

        title:
          post.title,

        slug:
          post.slug,

        category:
          post.category,

        excerpt:
          post.excerpt,

        image:
          post.image,

        readTime:
          post.readTime,

        date:
          formatBlogDate(
            post.publishedAt
          ),
      })
    );

  /* =======================================================
     DATABASE IS AUTHORITATIVE

     This is important now that /blog/[slug] exists.

     If a post is deleted or hidden in Admin, it must also
     disappear from the homepage instead of returning from
     seed data.

     It also prevents homepage links to seed articles that
     do not exist as public database article pages.
     ======================================================= */

  return {
    content,
    posts:
      formattedPosts,
  };
}

/* =========================================================
   BACKWARD-COMPATIBLE HELPER
   ========================================================= */

export async function getBlogPosts(): Promise<
  PublicBlogPost[]
> {
  const data =
    await getBlogHomepageData();

  return data.posts;
}