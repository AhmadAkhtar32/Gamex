import type {
  ReactNode,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Plus,
  Save,
} from "lucide-react";

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
  requireAdmin,
} from "@/lib/admin-auth";

import {
  saveBlogSettings,
  toggleBlogPostVisibility,
} from "./actions";

/* =========================================================
   TYPES
   ========================================================= */

type AdminBlogPageProps = {
  searchParams: Promise<{
    settingsSaved?: string;
    created?: string;
    updated?: string;
    deleted?: string;
    visibilityUpdated?: string;
    error?: string;
  }>;
};

/* =========================================================
   DEFAULT BLOG SETTINGS
   ========================================================= */

const DEFAULT_BLOG_SETTINGS = {
  id: "main",

  eyebrow:
    "The Gamex Blog",

  title:
    "Intel from the bench",

  accent:
    "bench",

  subtitle:
    "Build guides, benchmarks, hardware advice and everything you need to get more from your gaming setup.",

  readMoreText:
    "Read Story",

  isVisible:
    true,
};

/* =========================================================
   BLOG ADMIN PAGE
   ========================================================= */

export default async function AdminBlogPage({
  searchParams,
}: AdminBlogPageProps) {
  await requireAdmin();

  const query =
    await searchParams;

  /* =======================================================
     BLOG SETTINGS
     ======================================================= */

  const settingsRows =
    await db
      .select()
      .from(
        blogSettings
      )
      .where(
        eq(
          blogSettings.id,
          "main"
        )
      )
      .limit(1);

  const settings =
    settingsRows[0] ??
    DEFAULT_BLOG_SETTINGS;

  /* =======================================================
     POSTS
     ======================================================= */

  const posts =
    await db
      .select()
      .from(
        blogPosts
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

  const visibleCount =
    posts.filter(
      (post) =>
        post.isVisible
    ).length;

  const hiddenCount =
    posts.length -
    visibleCount;

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <header
        className="
          border-b
          border-brand/10
          bg-white
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
          <div>
            <p
              className="
                font-display
                text-lg
                font-extrabold
                uppercase
                tracking-widest
                text-brand-deep
              "
            >
              Gamex Admin
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              Blog Management
            </p>
          </div>

          <Link
            href="/admin"
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
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </header>

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div
        className="
          mx-auto
          max-w-7xl
          px-5
          py-10
          md:px-8
          md:py-14
        "
      >
        {/* ===================================================
            PAGE HEADING
            =================================================== */}

        <div
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.24em]
                text-brand
              "
            >
              Content
            </p>

            <h1
              className="
                mt-2
                font-display
                text-3xl
                font-extrabold
                uppercase
                text-brand-deep
                md:text-4xl
              "
            >
              Blog
            </h1>

            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                leading-relaxed
                text-slate-500
              "
            >
              Manage the homepage Blog section and publish,
              edit or hide Gamex articles.
            </p>
          </div>

          <Link
            href="/admin/blog/new"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-brand
              px-5
              py-3.5
              font-display
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
            <Plus className="h-4 w-4" />
            Add Blog Post
          </Link>
        </div>

        {/* ===================================================
            MESSAGES
            =================================================== */}

        {query.settingsSaved === "1" ? (
          <SuccessMessage>
            Blog section settings saved successfully.
          </SuccessMessage>
        ) : null}

        {query.created === "1" ? (
          <SuccessMessage>
            Blog post created successfully.
          </SuccessMessage>
        ) : null}

        {query.updated === "1" ? (
          <SuccessMessage>
            Blog post updated successfully.
          </SuccessMessage>
        ) : null}

        {query.deleted === "1" ? (
          <SuccessMessage>
            Blog post deleted successfully.
          </SuccessMessage>
        ) : null}

        {query.visibilityUpdated === "1" ? (
          <SuccessMessage>
            Blog post visibility updated.
          </SuccessMessage>
        ) : null}

        {query.error ? (
          <div
            className="
              mt-7
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-5
              py-4
              text-sm
              font-semibold
              text-red-700
            "
          >
            {query.error}
          </div>
        ) : null}

        {/* ===================================================
            SUMMARY
            =================================================== */}

        <div
          className="
            mt-8
            grid
            gap-4
            sm:grid-cols-3
          "
        >
          <SummaryCard
            value={
              String(
                posts.length
              )
            }
            label="Total Posts"
          />

          <SummaryCard
            value={
              String(
                visibleCount
              )
            }
            label="Visible"
          />

          <SummaryCard
            value={
              String(
                hiddenCount
              )
            }
            label="Hidden"
          />
        </div>

        {/* ===================================================
            BLOG SECTION SETTINGS
            =================================================== */}

        <section
          className="
            mt-8
            rounded-2xl
            border
            border-brand/10
            bg-white
            p-6
            md:p-8
          "
        >
          <SectionHeading
            icon={
              <BookOpen className="h-5 w-5" />
            }
            eyebrow="Homepage Section"
            title="Blog Settings"
            description="Control the heading and visibility of the Blog section shown on the homepage."
          />

          <form
            action={
              saveBlogSettings
            }
            className="mt-7"
          >
            <div
              className="
                grid
                gap-6
                md:grid-cols-2
              "
            >
              <Field label="Eyebrow">
                <input
                  name="eyebrow"
                  required
                  maxLength={255}
                  defaultValue={
                    settings.eyebrow
                  }
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Read More Text">
                <input
                  name="readMoreText"
                  required
                  maxLength={100}
                  defaultValue={
                    settings.readMoreText
                  }
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Section Title">
                <input
                  name="title"
                  required
                  maxLength={255}
                  defaultValue={
                    settings.title
                  }
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Accent Word">
                <input
                  name="accent"
                  maxLength={120}
                  defaultValue={
                    settings.accent
                  }
                  placeholder="bench"
                  className={
                    inputClass
                  }
                />

                <p
                  className="
                    mt-2
                    text-xs
                    leading-relaxed
                    text-slate-400
                  "
                >
                  This word can be highlighted in the public
                  section heading.
                </p>
              </Field>
            </div>

            <div className="mt-6">
              <Field label="Subtitle">
                <textarea
                  name="subtitle"
                  required
                  rows={4}
                  defaultValue={
                    settings.subtitle
                  }
                  className={`${inputClass} resize-y`}
                />
              </Field>
            </div>

            <div
              className="
                mt-6
                flex
                flex-col
                gap-4
                rounded-xl
                border
                border-brand/10
                bg-[#f7f9fc]
                p-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-3
                "
              >
                <input
                  name="isVisible"
                  type="checkbox"
                  defaultChecked={
                    settings.isVisible
                  }
                  className="
                    h-4
                    w-4
                    accent-[#173160]
                  "
                />

                <span
                  className="
                    text-sm
                    font-bold
                    text-brand-deep
                  "
                >
                  Show Blog section on website
                </span>
              </label>

              <button
                type="submit"
                className="
                  inline-flex
                  items-center
                  justify-center
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
                <Save className="h-4 w-4" />
                Save Settings
              </button>
            </div>
          </form>
        </section>

        {/* ===================================================
            POSTS
            =================================================== */}

        <section
          className="
            mt-8
            rounded-2xl
            border
            border-brand/10
            bg-white
            p-6
            md:p-8
          "
        >
          <SectionHeading
            icon={
              <FileText className="h-5 w-5" />
            }
            eyebrow="Articles"
            title="Blog Posts"
            description="Create, edit, reorder and control which articles are visible to customers."
          />

          {/* =================================================
              EMPTY STATE
              ================================================= */}

          {posts.length === 0 ? (
            <div
              className="
                mt-7
                rounded-2xl
                border
                border-dashed
                border-brand/20
                bg-[#f7f9fc]
                px-6
                py-14
                text-center
              "
            >
              <div
                className="
                  mx-auto
                  grid
                  h-14
                  w-14
                  place-items-center
                  rounded-2xl
                  bg-brand/[0.08]
                  text-brand
                "
              >
                <BookOpen className="h-6 w-6" />
              </div>

              <h3
                className="
                  mt-5
                  font-display
                  text-xl
                  font-extrabold
                  uppercase
                  text-brand-deep
                "
              >
                No Blog Posts
              </h3>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-md
                  text-sm
                  leading-relaxed
                  text-slate-500
                "
              >
                Create your first Gamex Blog article and it
                will appear here.
              </p>

              <Link
                href="/admin/blog/new"
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
                  text-white
                "
              >
                <Plus className="h-4 w-4" />
                Create First Post
              </Link>
            </div>
          ) : (
            /* ===============================================
               POST LIST
               =============================================== */

            <div
              className="
                mt-7
                grid
                gap-5
              "
            >
              {posts.map(
                (post) => (
                  <article
                    key={
                      post.id
                    }
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-brand/10
                      bg-white
                    "
                  >
                    <div
                      className="
                        grid
                        md:grid-cols-[190px_1fr]
                      "
                    >
                      {/* =====================================
                          IMAGE
                          ===================================== */}

                      <div
                        className="
                          relative
                          min-h-44
                          overflow-hidden
                          bg-slate-100
                          md:min-h-full
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
                          className="
                            absolute
                            inset-0
                            h-full
                            w-full
                            object-cover
                          "
                        />
                      </div>

                      {/* =====================================
                          CONTENT
                          ===================================== */}

                      <div className="p-5 md:p-6">
                        <div
                          className="
                            flex
                            flex-col
                            gap-4
                            lg:flex-row
                            lg:items-start
                            lg:justify-between
                          "
                        >
                          <div>
                            <div
                              className="
                                flex
                                flex-wrap
                                items-center
                                gap-2
                              "
                            >
                              <span
                                className="
                                  rounded-full
                                  bg-brand/[0.08]
                                  px-3
                                  py-1
                                  text-[10px]
                                  font-bold
                                  uppercase
                                  tracking-wider
                                  text-brand
                                "
                              >
                                {
                                  post.category
                                }
                              </span>

                              <VisibilityBadge
                                visible={
                                  post.isVisible
                                }
                              />

                              <span
                                className="
                                  rounded-full
                                  bg-slate-100
                                  px-3
                                  py-1
                                  text-[10px]
                                  font-bold
                                  uppercase
                                  text-slate-500
                                "
                              >
                                Order{" "}
                                {
                                  post.sortOrder
                                }
                              </span>
                            </div>

                            <h3
                              className="
                                mt-4
                                max-w-2xl
                                font-display
                                text-lg
                                font-extrabold
                                text-brand-deep
                                md:text-xl
                              "
                            >
                              {
                                post.title
                              }
                            </h3>

                            <p
                              className="
                                mt-2
                                max-w-3xl
                                text-sm
                                leading-relaxed
                                text-slate-500
                              "
                            >
                              {
                                post.excerpt
                              }
                            </p>
                          </div>

                          {/* =================================
                              EDIT
                              ================================= */}

                          <Link
                            href={`/admin/blog/${post.id}/edit`}
                            className="
                              inline-flex
                              shrink-0
                              items-center
                              justify-center
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
                              text-brand
                              transition-all
                              hover:border-brand
                              hover:bg-brand
                              hover:text-white
                            "
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </Link>
                        </div>

                        {/* ===================================
                            META / ACTIONS
                            =================================== */}

                        <div
                          className="
                            mt-5
                            flex
                            flex-col
                            gap-4
                            border-t
                            border-brand/10
                            pt-5
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                          "
                        >
                          <div
                            className="
                              flex
                              flex-wrap
                              items-center
                              gap-x-5
                              gap-y-2
                              text-xs
                              text-slate-400
                            "
                          >
                            <span
                              className="
                                inline-flex
                                items-center
                                gap-2
                              "
                            >
                              <CalendarDays className="h-3.5 w-3.5" />

                              {formatDate(
                                post.publishedAt
                              )}
                            </span>

                            <span>
                              {
                                post.readTime
                              }
                            </span>

                            <span
                              className="
                                max-w-[280px]
                                truncate
                              "
                            >
                              /blog/
                              {
                                post.slug
                              }
                            </span>
                          </div>

                          {/* =================================
                              SHOW / HIDE
                              ================================= */}

                          <form
                            action={
                              toggleBlogPostVisibility
                            }
                          >
                            <input
                              type="hidden"
                              name="postId"
                              value={
                                post.id
                              }
                            />

                            <button
                              type="submit"
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
                                text-brand
                                transition-all
                                hover:border-brand
                                hover:bg-brand
                                hover:text-white
                              "
                            >
                              {post.isVisible ? (
                                <>
                                  <EyeOff className="h-4 w-4" />
                                  Hide Post
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4" />
                                  Show Post
                                </>
                              )}
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   SUCCESS MESSAGE
   ========================================================= */

function SuccessMessage({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="
        mt-7
        rounded-xl
        border
        border-emerald-200
        bg-emerald-50
        px-5
        py-4
        text-sm
        font-semibold
        text-emerald-700
      "
    >
      {children}
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
   ========================================================= */

function SummaryCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-brand/10
        bg-white
        p-5
      "
    >
      <p
        className="
          font-display
          text-3xl
          font-extrabold
          text-brand-deep
        "
      >
        {value}
      </p>

      <p
        className="
          mt-1
          text-xs
          font-bold
          uppercase
          tracking-wider
          text-slate-400
        "
      >
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   SECTION HEADING
   ========================================================= */

function SectionHeading({
  icon,
  eyebrow,
  title,
  description,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-5
      "
    >
      <div>
        <p
          className="
            text-xs
            font-bold
            uppercase
            tracking-[0.18em]
            text-brand
          "
        >
          {eyebrow}
        </p>

        <h2
          className="
            mt-2
            font-display
            text-2xl
            font-extrabold
            uppercase
            text-brand-deep
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-2
            max-w-xl
            text-sm
            leading-relaxed
            text-slate-500
          "
        >
          {description}
        </p>
      </div>

      <div
        className="
          grid
          h-12
          w-12
          shrink-0
          place-items-center
          rounded-xl
          bg-brand/[0.08]
          text-brand
        "
      >
        {icon}
      </div>
    </div>
  );
}

/* =========================================================
   FIELD
   ========================================================= */

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
      </label>

      {children}
    </div>
  );
}

/* =========================================================
   VISIBILITY BADGE
   ========================================================= */

function VisibilityBadge({
  visible,
}: {
  visible: boolean;
}) {
  return (
    <span
      className={`
        rounded-full
        px-3
        py-1
        text-[10px]
        font-bold
        uppercase
        tracking-wider

        ${
          visible
            ? "bg-emerald-50 text-emerald-700"
            : "bg-slate-100 text-slate-500"
        }
      `}
    >
      {visible
        ? "Visible"
        : "Hidden"}
    </span>
  );
}

/* =========================================================
   DATE
   ========================================================= */

function formatDate(
  value: Date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  ).format(value);
}

/* =========================================================
   STYLES
   ========================================================= */

const labelClass = `
  mb-2
  block
  text-xs
  font-bold
  uppercase
  tracking-wider
  text-slate-600
`;

const inputClass = `
  w-full
  rounded-xl
  border
  border-brand/15
  bg-[#f7f9fc]
  px-4
  py-3.5
  text-sm
  text-brand-deep
  outline-none
  transition-all
  placeholder:text-slate-400
  hover:border-brand/25
  focus:border-brand/60
  focus:bg-white
  focus:shadow-[0_0_0_3px_rgba(23,49,96,0.10)]
`;