import type {
  ReactNode,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  Gauge,
  MousePointerClick,
  Save,
  Sparkles,
  Type,
} from "lucide-react";

import {
  asc,
  eq,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  heroMedia,
  heroSettings,
} from "@/db/schema";

import {
  requireAdmin,
} from "@/lib/admin-auth";

import {
  DEFAULT_HERO_CONTENT,
} from "@/lib/hero-content";

import {
  HeroMediaManager,
} from "./HeroMediaManager";

import {
  saveHeroSettings,
} from "./actions";

/* =========================================================
   TYPES
   ========================================================= */

type HeroAdminPageProps = {
  searchParams: Promise<{
    error?: string;
    saved?: string;
  }>;
};

/* =========================================================
   INPUT CLASS
   ========================================================= */

const inputClass = `
  w-full

  rounded-xl

  border
  border-brand/15

  bg-white

  px-4
  py-3

  text-sm
  text-brand-deep

  outline-none

  transition-all

  placeholder:text-slate-400

  focus:border-brand/50

  focus:shadow-[0_0_0_4px_rgba(230,0,0,0.08)]
`;

/* =========================================================
   PAGE
   ========================================================= */

export default async function HeroAdminPage({
  searchParams,
}: HeroAdminPageProps) {
  await requireAdmin();

  const query =
    await searchParams;

  /* =======================================================
     LOAD HERO
     ======================================================= */

  const heroRows =
    await db
      .select()
      .from(
        heroSettings
      )
      .where(
        eq(
          heroSettings.id,
          "main"
        )
      )
      .limit(
        1
      );

  const hero =
    heroRows[0] ??
    DEFAULT_HERO_CONTENT;

  const rotatingWords =
    hero.rotatingWords.join(
      "\n"
    );

  /* =======================================================
     LOAD MEDIA
     ======================================================= */

  const mediaItems =
    await db
      .select({
        id:
          heroMedia.id,

        mediaType:
          heroMedia.mediaType,

        url:
          heroMedia.url,

        alt:
          heroMedia.alt,

        isVisible:
          heroMedia.isVisible,

        sortOrder:
          heroMedia.sortOrder,
      })
      .from(
        heroMedia
      )
      .orderBy(
        asc(
          heroMedia.sortOrder
        ),

        asc(
          heroMedia.id
        )
      );

  return (
    <main className="min-h-screen bg-[#fff8f8]">
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

            max-w-6xl

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
              Website Content
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

          max-w-6xl

          px-5
          py-10

          md:px-8
          md:py-14
        "
      >
        {/* TITLE */}

        <div>
          <div
            className="
              inline-flex

              items-center

              gap-2

              rounded-full

              bg-brand/[0.07]

              px-3
              py-1.5

              text-xs

              font-bold

              uppercase

              tracking-[0.2em]

              text-brand
            "
          >
            <Sparkles className="h-3.5 w-3.5" />

            Homepage
          </div>

          <h1
            className="
              mt-4

              font-display

              text-3xl

              font-extrabold

              uppercase

              text-brand-deep

              md:text-4xl
            "
          >
            Hero Settings
          </h1>

          <p
            className="
              mt-3

              max-w-3xl

              text-sm

              leading-relaxed

              text-slate-500
            "
          >
            Manage the Hero text and its image/video slider.
            The old floating specification cards are no longer
            displayed on the public website.
          </p>
        </div>

        {/* STATUS */}

        {query.saved ===
        "1" ? (
          <div
            className="
              mt-7

              flex

              items-start

              gap-3

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
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            Hero settings saved successfully.
          </div>
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
            HERO MEDIA
            =================================================== */}

        <div
          className="
            mt-8

            rounded-3xl

            border
            border-brand/10

            bg-white

            p-5

            shadow-[0_30px_80px_-50px_rgba(230,0,0,0.32)]

            sm:p-7
          "
        >
          <div
            className="
              mb-6

              flex

              items-start

              gap-3

              border-b
              border-brand/10

              pb-5
            "
          >
            <span
              className="
                grid

                h-10
                w-10

                shrink-0

                place-items-center

                rounded-xl

                bg-brand

                text-white
              "
            >
              <Eye className="h-5 w-5" />
            </span>

            <div>
              <h2
                className="
                  font-display

                  text-lg

                  font-extrabold

                  uppercase

                  text-brand-deep
                "
              >
                Hero Image / Video Slider
              </h2>

              <p
                className="
                  mt-1

                  text-xs

                  leading-relaxed

                  text-slate-500
                "
              >
                Up to 10 media items. Images and videos are
                displayed using contain mode, so the complete
                media remains visible without cropping.
              </p>
            </div>
          </div>

          <HeroMediaManager
            items={
              mediaItems
            }
          />
        </div>

        {/* ===================================================
            HERO TEXT FORM
            =================================================== */}

        <form
          action={
            saveHeroSettings
          }
          className="
            mt-8

            space-y-6
          "
        >
          {/* HEADLINE */}

          <SettingsCard
            icon={
              <Type className="h-5 w-5" />
            }
            title="Hero Headline"
            description="Control the eyebrow, large heading and rotating word animation."
          >
            <div
              className="
                grid

                gap-5

                md:grid-cols-2
              "
            >
              <FormField
                label="Eyebrow"
                htmlFor="eyebrow"
              >
                <input
                  id="eyebrow"
                  name="eyebrow"
                  type="text"
                  required
                  maxLength={255}
                  defaultValue={
                    hero.eyebrow
                  }
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField
                label="Heading Line 1"
                htmlFor="headingLine1"
              >
                <input
                  id="headingLine1"
                  name="headingLine1"
                  type="text"
                  required
                  maxLength={255}
                  defaultValue={
                    hero.headingLine1
                  }
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField
                label="Heading Line 2"
                htmlFor="headingLine2"
              >
                <input
                  id="headingLine2"
                  name="headingLine2"
                  type="text"
                  required
                  maxLength={255}
                  defaultValue={
                    hero.headingLine2
                  }
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField
                label="Rotating Words"
                htmlFor="rotatingWords"
                help="Enter one rotating word or phrase per line."
              >
                <textarea
                  id="rotatingWords"
                  name="rotatingWords"
                  required
                  rows={5}
                  defaultValue={
                    rotatingWords
                  }
                  className={`${inputClass} resize-y`}
                />
              </FormField>
            </div>

            <div className="mt-5">
              <FormField
                label="Description"
                htmlFor="description"
              >
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  defaultValue={
                    hero.description
                  }
                  className={`${inputClass} resize-y`}
                />
              </FormField>
            </div>
          </SettingsCard>

          {/* BUTTONS */}

          <SettingsCard
            icon={
              <MousePointerClick className="h-5 w-5" />
            }
            title="Hero Buttons"
            description="Manage the two Hero call-to-action buttons."
          >
            <div
              className="
                grid

                gap-6

                lg:grid-cols-2
              "
            >
              {/* PRIMARY */}

              <div
                className="
                  rounded-2xl

                  border
                  border-brand/10

                  bg-[#fffafa]

                  p-5
                "
              >
                <p
                  className="
                    text-[10px]

                    font-extrabold

                    uppercase

                    tracking-[0.18em]

                    text-brand
                  "
                >
                  Primary Button
                </p>

                <div className="mt-4 space-y-4">
                  <FormField
                    label="Button Text"
                    htmlFor="primaryButtonText"
                  >
                    <input
                      id="primaryButtonText"
                      name="primaryButtonText"
                      type="text"
                      required
                      maxLength={120}
                      defaultValue={
                        hero.primaryButtonText
                      }
                      className={
                        inputClass
                      }
                    />
                  </FormField>

                  <FormField
                    label="Button Link"
                    htmlFor="primaryButtonLink"
                    help="Examples: #builds, /shop or https://..."
                  >
                    <input
                      id="primaryButtonLink"
                      name="primaryButtonLink"
                      type="text"
                      required
                      maxLength={500}
                      defaultValue={
                        hero.primaryButtonLink
                      }
                      className={
                        inputClass
                      }
                    />
                  </FormField>
                </div>
              </div>

              {/* SECONDARY */}

              <div
                className="
                  rounded-2xl

                  border
                  border-brand/10

                  bg-[#fffafa]

                  p-5
                "
              >
                <p
                  className="
                    text-[10px]

                    font-extrabold

                    uppercase

                    tracking-[0.18em]

                    text-brand
                  "
                >
                  Secondary Button
                </p>

                <div className="mt-4 space-y-4">
                  <FormField
                    label="Button Text"
                    htmlFor="secondaryButtonText"
                  >
                    <input
                      id="secondaryButtonText"
                      name="secondaryButtonText"
                      type="text"
                      required
                      maxLength={120}
                      defaultValue={
                        hero.secondaryButtonText
                      }
                      className={
                        inputClass
                      }
                    />
                  </FormField>

                  <FormField
                    label="Button Link"
                    htmlFor="secondaryButtonLink"
                  >
                    <input
                      id="secondaryButtonLink"
                      name="secondaryButtonLink"
                      type="text"
                      required
                      maxLength={500}
                      defaultValue={
                        hero.secondaryButtonLink
                      }
                      className={
                        inputClass
                      }
                    />
                  </FormField>
                </div>
              </div>
            </div>
          </SettingsCard>

          {/* TRUST POINTS */}

          <SettingsCard
            icon={
              <Gauge className="h-5 w-5" />
            }
            title="Trust Points"
            description="The three small selling points underneath the Hero buttons."
          >
            <div
              className="
                grid

                gap-5

                lg:grid-cols-3
              "
            >
              <FormField
                label="Trust Point 1"
                htmlFor="trustPoint1"
              >
                <input
                  id="trustPoint1"
                  name="trustPoint1"
                  type="text"
                  required
                  maxLength={255}
                  defaultValue={
                    hero.trustPoint1
                  }
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField
                label="Trust Point 2"
                htmlFor="trustPoint2"
              >
                <input
                  id="trustPoint2"
                  name="trustPoint2"
                  type="text"
                  required
                  maxLength={255}
                  defaultValue={
                    hero.trustPoint2
                  }
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField
                label="Trust Point 3"
                htmlFor="trustPoint3"
              >
                <input
                  id="trustPoint3"
                  name="trustPoint3"
                  type="text"
                  required
                  maxLength={255}
                  defaultValue={
                    hero.trustPoint3
                  }
                  className={
                    inputClass
                  }
                />
              </FormField>
            </div>
          </SettingsCard>

          {/* VISIBILITY */}

          <div
            className="
              rounded-2xl

              border
              border-brand/10

              bg-white

              p-6

              shadow-[0_25px_65px_-45px_rgba(230,0,0,0.3)]
            "
          >
            <label
              htmlFor="isVisible"
              className="
                flex

                cursor-pointer

                items-start

                gap-3
              "
            >
              <input
                id="isVisible"
                name="isVisible"
                type="checkbox"
                defaultChecked={
                  hero.isVisible
                }
                className="
                  mt-1

                  h-4
                  w-4

                  accent-[#e60000]
                "
              />

              <span>
                <span
                  className="
                    block

                    text-sm

                    font-bold

                    text-brand-deep
                  "
                >
                  Hero visible on website
                </span>

                <span
                  className="
                    mt-1

                    block

                    text-xs

                    leading-relaxed

                    text-slate-500
                  "
                >
                  Turning this off hides the complete Hero
                  section from the public homepage.
                </span>
              </span>
            </label>
          </div>

          {/* SAVE */}

          <div
            className="
              sticky

              bottom-4

              z-20

              flex

              flex-col

              gap-3

              rounded-2xl

              border
              border-brand/10

              bg-white/95

              p-4

              shadow-[0_20px_55px_-30px_rgba(230,0,0,0.3)]

              backdrop-blur-xl

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <p className="text-xs text-slate-500">
              Slider media saves separately. This button saves
              Hero text, buttons and visibility.
            </p>

            <div className="flex gap-3">
              <Link
                href="/admin"
                className="
                  inline-flex

                  items-center
                  justify-center

                  rounded-xl

                  border
                  border-brand/15

                  bg-white

                  px-5
                  py-3

                  text-xs

                  font-bold

                  uppercase

                  tracking-wider

                  text-brand

                  transition-all

                  hover:bg-brand/[0.05]
                "
              >
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

                  px-6
                  py-3

                  font-display

                  text-xs

                  font-bold

                  uppercase

                  tracking-wider

                  text-white

                  transition-all

                  hover:-translate-y-0.5

                  hover:bg-[#c90000]
                "
              >
                <Save className="h-4 w-4" />

                Save Hero
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

/* =========================================================
   SETTINGS CARD
   ========================================================= */

function SettingsCard({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;

  title: string;

  description: string;

  children: ReactNode;
}) {
  return (
    <section
      className="
        rounded-3xl

        border
        border-brand/10

        bg-white

        p-5

        shadow-[0_30px_80px_-50px_rgba(230,0,0,0.3)]

        sm:p-7
      "
    >
      <div
        className="
          flex

          items-start

          gap-3

          border-b
          border-brand/10

          pb-5
        "
      >
        <span
          className="
            grid

            h-10
            w-10

            shrink-0

            place-items-center

            rounded-xl

            bg-brand/[0.08]

            text-brand
          "
        >
          {icon}
        </span>

        <div>
          <h2
            className="
              font-display

              text-lg

              font-extrabold

              uppercase

              text-brand-deep
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-1

              text-xs

              leading-relaxed

              text-slate-500
            "
          >
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6">
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   FORM FIELD
   ========================================================= */

function FormField({
  label,
  htmlFor,
  help,
  children,
}: {
  label: string;

  htmlFor: string;

  help?: string;

  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={
          htmlFor
        }
        className="
          mb-2

          block

          text-[10px]

          font-extrabold

          uppercase

          tracking-[0.15em]

          text-brand-deep
        "
      >
        {label}
      </label>

      {children}

      {help ? (
        <p
          className="
            mt-2

            text-xs

            leading-relaxed

            text-slate-400
          "
        >
          {help}
        </p>
      ) : null}
    </div>
  );
}