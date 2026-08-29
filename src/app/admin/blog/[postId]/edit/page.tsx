import type {
  ReactNode,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  Eye,
  FileImage,
  FileText,
  Link2,
  Save,
} from "lucide-react";

import {
  eq,
} from "drizzle-orm";

import {
  notFound,
} from "next/navigation";

import { db } from "@/db";

import {
  blogPosts,
} from "@/db/schema";

import {
  requireAdmin,
} from "@/lib/admin-auth";

import {
  updateBlogPost,
} from "../../actions";

import BlogContentEditor from "../../BlogContentEditor";

import DeleteBlogPostButton from "../../DeleteBlogPostButton";

/* =========================================================
   TYPES
   ========================================================= */

type EditBlogPostPageProps = {
  params: Promise<{
    postId: string;
  }>;

  searchParams: Promise<{
    error?: string;
  }>;
};

/* =========================================================
   PAGE
   ========================================================= */

export default async function EditBlogPostPage({
  params,
  searchParams,
}: EditBlogPostPageProps) {
  await requireAdmin();

  const {
    postId,
  } = await params;

  const query =
    await searchParams;

  /* =======================================================
     VALIDATE POST ID
     ======================================================= */

  const id =
    Number.parseInt(
      postId,
      10
    );

  if (
    !Number.isFinite(id) ||
    id <= 0
  ) {
    notFound();
  }

  /* =======================================================
     LOAD POST
     ======================================================= */

  const rows =
    await db
      .select()
      .from(
        blogPosts
      )
      .where(
        eq(
          blogPosts.id,
          id
        )
      )
      .limit(1);

  const post =
    rows[0];

  if (!post) {
    notFound();
  }

  /* =======================================================
     DATE
     ======================================================= */

  const publishedDate =
    post.publishedAt
      .toISOString()
      .slice(0, 10);

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
            max-w-5xl
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

            <p
              className="
                mt-0.5
                text-xs
                text-slate-500
              "
            >
              Edit Blog Post
            </p>
          </div>

          <Link
            href="/admin/blog"
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

            Blog
          </Link>
        </div>
      </header>

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div
        className="
          mx-auto
          max-w-5xl
          px-5
          py-10
          md:px-8
          md:py-14
        "
      >
        {/* ===================================================
            HEADING
            =================================================== */}

        <div>
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.24em]
                text-brand
              "
            >
              Edit Article
            </p>

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
                  post.isVisible
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }
              `}
            >
              {post.isVisible
                ? "Published"
                : "Hidden"}
            </span>
          </div>

          <h1
            className="
              mt-2
              max-w-4xl
              font-display
              text-3xl
              font-extrabold
              leading-tight
              text-brand-deep
              md:text-4xl
            "
          >
            {post.title}
          </h1>

          <p
            className="
              mt-3
              text-sm
              text-slate-500
            "
          >
            /blog/{post.slug}
          </p>
        </div>

        {/* ===================================================
            ERROR
            =================================================== */}

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
            UPDATE FORM
            =================================================== */}

        <form
          action={
            updateBlogPost
          }
          className="
            mt-8
            space-y-8
          "
        >
          <input
            type="hidden"
            name="postId"
            value={post.id}
          />

          <input
            type="hidden"
            name="currentImage"
            value={post.image}
          />

          {/* =================================================
              BASIC INFORMATION
              ================================================= */}

          <SectionCard
            icon={
              <FileText className="h-5 w-5" />
            }
            eyebrow="Article"
            title="Basic Information"
          >
            <div
              className="
                grid
                gap-6
                md:grid-cols-2
              "
            >
              <div className="md:col-span-2">
                <Field label="Post Title">
                  <input
                    name="title"
                    required
                    maxLength={255}
                    defaultValue={
                      post.title
                    }
                    className={
                      inputClass
                    }
                  />
                </Field>
              </div>

              <Field label="URL Slug">
                <input
                  name="slug"
                  required
                  maxLength={255}
                  defaultValue={
                    post.slug
                  }
                  className={
                    inputClass
                  }
                />

                <p className={helperClass}>
                  Changing the slug also changes the public
                  article URL.
                </p>
              </Field>

              <Field label="Category">
                <input
                  name="category"
                  required
                  maxLength={100}
                  defaultValue={
                    post.category
                  }
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Read Time">
                <input
                  name="readTime"
                  required
                  maxLength={60}
                  defaultValue={
                    post.readTime
                  }
                  className={
                    inputClass
                  }
                />

                <p className={helperClass}>
                  Example: 6 min read
                </p>
              </Field>

              <Field label="Display Order">
                <input
                  name="sortOrder"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={
                    post.sortOrder
                  }
                  className={
                    inputClass
                  }
                />

                <p className={helperClass}>
                  Lower numbers appear first.
                </p>
              </Field>
            </div>

            <div className="mt-6">
              <Field label="Excerpt">
                <textarea
                  name="excerpt"
                  required
                  rows={4}
                  defaultValue={
                    post.excerpt
                  }
                  className={`
                    ${inputClass}
                    resize-y
                  `}
                />

                <p className={helperClass}>
                  This short summary appears on the homepage
                  Blog card.
                </p>
              </Field>
            </div>
          </SectionCard>

          {/* =================================================
              ARTICLE CONTENT
              ================================================= */}

          <SectionCard
            icon={
              <FileText className="h-5 w-5" />
            }
            eyebrow="Article Body"
            title="Full Content"
          >
            <Field label="Article Content">
              <BlogContentEditor
                defaultValue={
                  post.content
                }
                placeholder={`Write the complete Blog article here.

Example:

## Choosing the Right Processor

Your CPU determines how well your system handles games and other workloads.

## Choosing a Graphics Card

The GPU has the biggest impact on gaming performance.

### Cooling Matters

Good airflow helps your components maintain higher performance.

- Use intake fans
- Use exhaust fans
- Keep cables organized

You can also use **bold text** for important information.`}
              />
            </Field>

            <div
              className="
                mt-4
                rounded-xl
                border
                border-brand/10
                bg-[#f7f9fc]
                p-4
              "
            >
              <p
                className="
                  text-xs
                  leading-relaxed
                  text-slate-500
                "
              >
                Select text and use the formatting toolbar.
                Headings, bold text, bullet lists and numbered
                lists will be rendered on the public article
                page.
              </p>
            </div>
          </SectionCard>

          {/* =================================================
              FEATURED IMAGE
              ================================================= */}

          <SectionCard
            icon={
              <FileImage className="h-5 w-5" />
            }
            eyebrow="Featured Image"
            title="Blog Artwork"
          >
            <div
              className="
                grid
                gap-8
                lg:grid-cols-[320px_1fr]
              "
            >
              {/* CURRENT IMAGE */}

              <div>
                <p className={labelClass}>
                  Current Image
                </p>

                <div
                  className="
                    relative
                    aspect-[16/10]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-brand/10
                    bg-slate-100
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

                <p
                  className="
                    mt-3
                    break-all
                    text-[11px]
                    leading-relaxed
                    text-slate-400
                  "
                >
                  {post.image}
                </p>
              </div>

              {/* REPLACEMENT */}

              <div className="space-y-6">
                <Field label="Upload Replacement Image">
                  <label
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-4
                      rounded-2xl
                      border
                      border-dashed
                      border-brand/25
                      bg-[#f7f9fc]
                      p-5
                      transition-all
                      hover:border-brand/50
                      hover:bg-brand/[0.03]
                    "
                  >
                    <div
                      className="
                        grid
                        h-11
                        w-11
                        shrink-0
                        place-items-center
                        rounded-xl
                        bg-brand/[0.08]
                        text-brand
                      "
                    >
                      <FileImage className="h-5 w-5" />
                    </div>

                    <div>
                      <p
                        className="
                          text-sm
                          font-bold
                          text-brand-deep
                        "
                      >
                        Choose New Image
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-slate-400
                        "
                      >
                        JPG, PNG or WebP — maximum 5 MB
                      </p>
                    </div>

                    <input
                      name="imageFile"
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      className="sr-only"
                    />
                  </label>
                </Field>

                <Field label="Or Replace Using Image URL">
                  <div className="relative">
                    <Link2
                      className="
                        absolute
                        left-4
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      name="imageUrl"
                      type="url"
                      maxLength={1000}
                      placeholder="https://example.com/new-blog-image.jpg"
                      className={`
                        ${inputClass}
                        pl-11
                      `}
                    />
                  </div>

                  <p className={helperClass}>
                    Leave this blank to keep the current
                    image. If both URL and uploaded file are
                    supplied, the uploaded file is used.
                  </p>
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* =================================================
              PUBLISHING
              ================================================= */}

          <SectionCard
            icon={
              <CalendarDays className="h-5 w-5" />
            }
            eyebrow="Publishing"
            title="Date & Visibility"
          >
            <div
              className="
                grid
                gap-6
                md:grid-cols-2
              "
            >
              <Field label="Publication Date">
                <input
                  name="publishedDate"
                  type="date"
                  defaultValue={
                    publishedDate
                  }
                  className={
                    inputClass
                  }
                />
              </Field>

              <div>
                <p className={labelClass}>
                  Visibility
                </p>

                <label
                  className="
                    flex
                    min-h-[54px]
                    cursor-pointer
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-brand/15
                    bg-[#f7f9fc]
                    px-4
                    py-3
                  "
                >
                  <input
                    name="isVisible"
                    type="checkbox"
                    defaultChecked={
                      post.isVisible
                    }
                    className="
                      h-4
                      w-4
                      accent-[#173160]
                    "
                  />

                  <div>
                    <p
                      className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-bold
                        text-brand-deep
                      "
                    >
                      <Eye className="h-4 w-4 text-brand" />

                      Publish on website
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-slate-400
                      "
                    >
                      Uncheck this to keep the article hidden
                      from visitors.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </SectionCard>

          {/* =================================================
              SAVE
              ================================================= */}

          <div
            className="
              flex
              flex-col-reverse
              gap-3
              rounded-2xl
              border
              border-brand/10
              bg-white
              p-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <Link
              href="/admin/blog"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-brand/15
                px-5
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
              <ArrowLeft className="h-4 w-4" />

              Cancel
            </Link>

            <button
              type="submit"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-brand
                px-7
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
              <Save className="h-4 w-4" />

              Save Changes
            </button>
          </div>
        </form>

        {/* ===================================================
            DANGER ZONE
            =================================================== */}

        <section
          className="
            mt-8
            rounded-2xl
            border
            border-red-200
            bg-white
            p-6
            md:p-8
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-red-500
                "
              >
                Danger Zone
              </p>

              <h2
                className="
                  mt-2
                  font-display
                  text-xl
                  font-extrabold
                  uppercase
                  text-brand-deep
                "
              >
                Delete Article
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
                Deleting this article permanently removes it
                from Neon. Use visibility instead if you only
                want to temporarily remove it from the public
                website.
              </p>
            </div>

            <DeleteBlogPostButton
              postId={
                post.id
              }
              title={
                post.title
              }
              slug={
                post.slug
              }
            />
          </div>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   SECTION CARD
   ========================================================= */

function SectionCard({
  icon,
  eyebrow,
  title,
  children,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      className="
        rounded-2xl
        border
        border-brand/10
        bg-white
        p-6
        md:p-8
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-5
          border-b
          border-brand/10
          pb-5
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
        </div>

        <div
          className="
            grid
            h-11
            w-11
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

      <div className="mt-7">
        {children}
      </div>
    </section>
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
   SHARED STYLES
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

const helperClass = `
  mt-2
  text-xs
  leading-relaxed
  text-slate-400
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