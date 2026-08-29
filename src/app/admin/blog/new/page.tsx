import type {
  ReactNode,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  FileImage,
  FileText,
  Link2,
  Plus,
} from "lucide-react";

import {
  requireAdmin,
} from "@/lib/admin-auth";

import {
  createBlogPost,
} from "../actions";

/* =========================================================
   TYPES
   ========================================================= */

type NewBlogPostPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

/* =========================================================
   PAGE
   ========================================================= */

export default async function NewBlogPostPage({
  searchParams,
}: NewBlogPostPageProps) {
  await requireAdmin();

  const query =
    await searchParams;

  const today =
    new Date()
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

            <p className="mt-0.5 text-xs text-slate-500">
              Create Blog Post
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
          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.24em]
              text-brand
            "
          >
            New Article
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
            Add Blog Post
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
            Create a new Gamex article with its own title,
            category, image, excerpt and full article content.
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
            FORM
            =================================================== */}

        <form
          action={
            createBlogPost
          }
          className="
            mt-8
            space-y-8
          "
        >
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
                    placeholder="The Ultimate 2026 PC Build for 4K Gaming"
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="URL Slug">
                <input
                  name="slug"
                  maxLength={255}
                  placeholder="ultimate-2026-4k-gaming-build"
                  className={inputClass}
                />

                <p className={helperClass}>
                  Optional. Leave blank and Gamex will
                  automatically create one from the title.
                </p>
              </Field>

              <Field label="Category">
                <input
                  name="category"
                  required
                  maxLength={100}
                  placeholder="Build Guide"
                  className={inputClass}
                />

                <p className={helperClass}>
                  Examples: Build Guide, Hardware, Cooling,
                  Memory, Builds.
                </p>
              </Field>

              <Field label="Read Time">
                <input
                  name="readTime"
                  required
                  maxLength={60}
                  placeholder="6 min read"
                  className={inputClass}
                />
              </Field>

              <Field label="Display Order">
                <input
                  name="sortOrder"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue="0"
                  className={inputClass}
                />

                <p className={helperClass}>
                  Lower numbers appear before higher numbers.
                </p>
              </Field>
            </div>

            <div className="mt-6">
              <Field label="Excerpt">
                <textarea
                  name="excerpt"
                  required
                  rows={4}
                  placeholder="Write a short summary that will appear on the homepage Blog card..."
                  className={`${inputClass} resize-y`}
                />

                <p className={helperClass}>
                  Keep this short. It is the preview text
                  customers see before opening the article.
                </p>
              </Field>
            </div>
          </SectionCard>

          {/* =================================================
              FULL ARTICLE
              ================================================= */}

          <SectionCard
            icon={
              <FileText className="h-5 w-5" />
            }
            eyebrow="Article Body"
            title="Full Content"
          >
            <Field label="Article Content">
              <textarea
                name="content"
                rows={18}
                placeholder={`Write the full Blog article here.

Example:

Building a gaming PC is easier when you understand how each component works together.

1. Choose the right processor
Start by deciding what games and applications you plan to use...

2. Match your graphics card
Your GPU will have the biggest impact on gaming performance...

3. Don't ignore cooling
Good airflow keeps your components performing consistently...`}
                className={`${inputClass} min-h-[420px] resize-y font-mono leading-relaxed`}
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
                For now this is stored as plain article text.
                Later we will build the public{" "}
                <code className="font-bold text-brand">
                  /blog/[slug]
                </code>{" "}
                page and format paragraphs, headings and lists
                nicely.
              </p>
            </div>
          </SectionCard>

          {/* =================================================
              IMAGE
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
                gap-6
                md:grid-cols-2
              "
            >
              {/* UPLOAD */}

              <div>
                <p className={labelClass}>
                  Upload Image
                </p>

                <label
                  className="
                    flex
                    min-h-40
                    cursor-pointer
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-dashed
                    border-brand/25
                    bg-[#f7f9fc]
                    p-6
                    text-center
                    transition-all
                    hover:border-brand/50
                    hover:bg-brand/[0.03]
                  "
                >
                  <div
                    className="
                      grid
                      h-12
                      w-12
                      place-items-center
                      rounded-xl
                      bg-brand/[0.08]
                      text-brand
                    "
                  >
                    <FileImage className="h-5 w-5" />
                  </div>

                  <p
                    className="
                      mt-4
                      text-sm
                      font-bold
                      text-brand-deep
                    "
                  >
                    Choose Blog Image
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-400
                    "
                  >
                    JPG, PNG or WebP
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-400
                    "
                  >
                    Maximum size: 5 MB
                  </p>

                  <input
                    name="imageFile"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    className="sr-only"
                  />
                </label>
              </div>

              {/* URL */}

              <div>
                <p className={labelClass}>
                  Or Use Image URL
                </p>

                <div
                  className="
                    flex
                    min-h-40
                    flex-col
                    justify-center
                    rounded-2xl
                    border
                    border-brand/10
                    bg-[#f7f9fc]
                    p-5
                  "
                >
                  <div
                    className="
                      mb-4
                      flex
                      items-center
                      gap-2
                      text-brand
                    "
                  >
                    <Link2 className="h-4 w-4" />

                    <span
                      className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                      "
                    >
                      External Image
                    </span>
                  </div>

                  <input
                    name="imageUrl"
                    type="url"
                    maxLength={1000}
                    placeholder="https://example.com/blog-image.jpg"
                    className={inputClass}
                  />

                  <p className={helperClass}>
                    If you upload a file and also provide a
                    URL, the uploaded file will be used.
                  </p>
                </div>
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
                  defaultValue={today}
                  className={inputClass}
                />

                <p className={helperClass}>
                  This date will be displayed with the Blog
                  article.
                </p>
              </Field>

              <div>
                <p className={labelClass}>
                  Visibility
                </p>

                <label
                  className="
                    flex
                    min-h-[52px]
                    cursor-pointer
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-brand/15
                    bg-[#f7f9fc]
                    px-4
                  "
                >
                  <input
                    name="isVisible"
                    type="checkbox"
                    defaultChecked
                    className="
                      h-4
                      w-4
                      accent-[#173160]
                    "
                  />

                  <div>
                    <p
                      className="
                        text-sm
                        font-bold
                        text-brand-deep
                      "
                    >
                      Publish on website
                    </p>

                    <p
                      className="
                        text-xs
                        text-slate-400
                      "
                    >
                      Turn this off to save the article hidden.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </SectionCard>

          {/* =================================================
              SUBMIT
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
              <Plus className="h-4 w-4" />

              Create Blog Post
            </button>
          </div>
        </form>
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