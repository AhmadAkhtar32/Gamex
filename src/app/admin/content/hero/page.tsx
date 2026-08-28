import type { ReactNode } from "react";

import Link from "next/link";

import {
  ArrowLeft,
  CheckCircle2,
  Gauge,
  ImageIcon,
  LinkIcon,
  MousePointerClick,
  Save,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { heroSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

import { saveHeroSettings } from "./actions";

/* =========================================================
   DEFAULT HERO CONTENT

   These values match the current public Hero.tsx.
   They are used only when hero_settings is still empty.
   ========================================================= */

const DEFAULT_HERO = {
  id: "main",

  eyebrow:
    "Premium Gaming Hardware",

  headingLine1:
    "Dominate",

  headingLine2:
    "every",

  rotatingWords: [
    "MATCH.",
    "RAID.",
    "BATTLE.",
    "FRAME.",
  ],

  description:
    "Gamex builds custom high-performance gaming PCs and supplies pro-grade graphics cards, memory, processors and accessories — engineered for players who refuse to lose.",

  primaryButtonText:
    "Explore Builds",

  primaryButtonLink:
    "#builds",

  secondaryButtonText:
    "Shop Components",

  secondaryButtonLink:
    "#products",

  trustPoint1:
    "Benchmark-tested",

  trustPoint2:
    "Certified silicon",

  trustPoint3:
    "12,000+ happy gamers",

  image:
    "https://images.pexels.com/photos/34301924/pexels-photo-34301924.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",

  imageAlt:
    "Gamex custom gaming PC with RGB lighting",

  imageTitle:
    "Titan Series",

  imageSubtitle:
    "Flagship Build",

  imageBadge:
    "Live",

  chip1Title:
    "Flagship GPU",

  chip1Subtitle:
    "Next-gen VRAM",

  chip2Title:
    "High-Capacity",

  chip2Subtitle:
    "Blazing Fast Memory",

  chip3Title:
    "300+ FPS",

  chip3Subtitle:
    "Esports Ready",

  isVisible: true,
};

/* =========================================================
   PAGE TYPES
   ========================================================= */

type HeroAdminPageProps = {
  searchParams: Promise<{
    error?: string;
    saved?: string;
  }>;
};

/* =========================================================
   PAGE
   ========================================================= */

export default async function HeroAdminPage({
  searchParams,
}: HeroAdminPageProps) {
  /* =========================================================
     SECURITY
     ========================================================= */

  await requireAdmin();

  const query =
    await searchParams;

  /* =========================================================
     LOAD HERO FROM NEON
     ========================================================= */

  const rows = await db
    .select()
    .from(heroSettings)
    .where(
      eq(
        heroSettings.id,
        "main"
      )
    )
    .limit(1);

  /*
   * If Neon does not have a Hero row yet,
   * use the current Hero.tsx values.
   */
  const hero =
    rows[0] ??
    DEFAULT_HERO;

  const rotatingWords =
    hero.rotatingWords.join(
      "\n"
    );

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="border-b border-brand/10 bg-white">
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

            <p className="mt-0.5 text-xs text-slate-500">
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
          MAIN CONTENT
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
        {/* ===================================================
            TITLE
            =================================================== */}

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
            Manage the main Hero content displayed at the top of
            the Gamex homepage. The visual design, animations and
            effects remain protected in the website code.
          </p>
        </div>

        {/* ===================================================
            SUCCESS
            =================================================== */}

        {query.saved === "1" ? (
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
          action={saveHeroSettings}
          className="mt-8 space-y-7"
        >
          {/* =================================================
              HERO TEXT
              ================================================= */}

          <SettingsCard
            icon={
              <Zap className="h-5 w-5" />
            }
            title="Hero Text"
            description="Main headline and introductory content."
          >
            <div className="grid gap-6 md:grid-cols-2">
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

                <p className="mt-2 text-xs text-slate-400">
                  The rotating word appears after this text.
                </p>
              </FormField>

              <FormField
                label="Rotating Words"
                htmlFor="rotatingWords"
              >
                <textarea
                  id="rotatingWords"
                  name="rotatingWords"
                  required
                  rows={6}
                  defaultValue={
                    rotatingWords
                  }
                  className={`${inputClass} resize-y`}
                />

                <p className="mt-2 text-xs text-slate-400">
                  Enter one rotating word per line.
                </p>
              </FormField>
            </div>

            <div className="mt-6">
              <FormField
                label="Hero Description"
                htmlFor="description"
              >
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  defaultValue={
                    hero.description
                  }
                  className={`${inputClass} resize-y`}
                />
              </FormField>
            </div>
          </SettingsCard>

          {/* =================================================
              CTA BUTTONS
              ================================================= */}

          <SettingsCard
            icon={
              <MousePointerClick className="h-5 w-5" />
            }
            title="Hero Buttons"
            description="Control the two calls-to-action shown beneath the Hero description."
          >
            <div className="grid gap-6 md:grid-cols-2">
              {/* PRIMARY */}

              <div
                className="
                  rounded-xl
                  border
                  border-brand/10
                  bg-[#f7f9fc]
                  p-5
                "
              >
                <p
                  className="
                    mb-5
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-brand
                  "
                >
                  Primary Button
                </p>

                <div className="space-y-5">
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
                  >
                    <div className="relative">
                      <LinkIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        id="primaryButtonLink"
                        name="primaryButtonLink"
                        type="text"
                        required
                        maxLength={500}
                        defaultValue={
                          hero.primaryButtonLink
                        }
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                  </FormField>
                </div>
              </div>

              {/* SECONDARY */}

              <div
                className="
                  rounded-xl
                  border
                  border-brand/10
                  bg-[#f7f9fc]
                  p-5
                "
              >
                <p
                  className="
                    mb-5
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-brand
                  "
                >
                  Secondary Button
                </p>

                <div className="space-y-5">
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
                    <div className="relative">
                      <LinkIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        id="secondaryButtonLink"
                        name="secondaryButtonLink"
                        type="text"
                        required
                        maxLength={500}
                        defaultValue={
                          hero.secondaryButtonLink
                        }
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                  </FormField>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              You can use section links such as #builds and
              #products, internal paths such as /contact, or full
              https:// links.
            </p>
          </SettingsCard>

          {/* =================================================
              TRUST POINTS
              ================================================= */}

          <SettingsCard
            icon={
              <Gauge className="h-5 w-5" />
            }
            title="Trust Points"
            description="Three short benefit statements displayed below the Hero buttons."
          >
            <div className="grid gap-6 md:grid-cols-3">
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

          {/* =================================================
              HERO IMAGE
              ================================================= */}

          <SettingsCard
            icon={
              <ImageIcon className="h-5 w-5" />
            }
            title="Hero Image"
            description="Manage the large gaming PC image shown on the right side of the Hero."
          >
            {/* Current image */}

            <div
              className="
                rounded-xl
                border
                border-brand/10
                bg-[#f7f9fc]
                p-5
              "
            >
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Current Image
              </p>

              <div
                className="
                  mt-4
                  flex
                  flex-col
                  gap-5
                  md:flex-row
                  md:items-center
                "
              >
                <div
                  className="
                    aspect-[4/3]
                    w-full
                    overflow-hidden
                    rounded-xl
                    border
                    border-brand/10
                    bg-white
                    md:w-72
                  "
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hero.image}
                    alt={
                      hero.imageAlt
                    }
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-brand-deep">
                    Hero image currently in use
                  </p>

                  <p className="mt-2 break-all text-xs leading-relaxed text-slate-400">
                    {hero.image}
                  </p>
                </div>
              </div>
            </div>

            {/* PC upload */}

            <div className="mt-6">
              <label
                htmlFor="imageFile"
                className="
                  mb-2
                  block
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-600
                "
              >
                Upload From PC
              </label>

              <div
                className="
                  rounded-xl
                  border
                  border-dashed
                  border-brand/25
                  bg-[#f7f9fc]
                  p-7
                  text-center
                "
              >
                <div
                  className="
                    mx-auto
                    grid
                    h-11
                    w-11
                    place-items-center
                    rounded-xl
                    bg-brand/[0.08]
                    text-brand
                  "
                >
                  <Upload className="h-5 w-5" />
                </div>

                <p className="mt-3 text-sm font-bold text-brand-deep">
                  Choose Hero Image
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  JPG, PNG or WebP — maximum 5 MB
                </p>

                <input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="
                    mt-4
                    block
                    w-full
                    text-xs
                    text-slate-500

                    file:mr-4
                    file:rounded-lg
                    file:border-0
                    file:bg-brand
                    file:px-4
                    file:py-2.5
                    file:text-xs
                    file:font-bold
                    file:text-white

                    hover:file:bg-brand-soft
                  "
                />
              </div>
            </div>

            {/* OR */}

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-brand/10" />

              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-slate-400
                "
              >
                Or
              </span>

              <div className="h-px flex-1 bg-brand/10" />
            </div>

            {/* Image URL */}

            <FormField
              label="Image URL"
              htmlFor="imageUrl"
            >
              <div className="relative">
                <LinkIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  maxLength={1000}
                  defaultValue={
                    hero.image
                  }
                  className={`${inputClass} pl-11`}
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                If you upload an image from your PC, that image
                takes priority over this URL.
              </p>
            </FormField>

            {/* Image text */}

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <FormField
                label="Image Alt Text"
                htmlFor="imageAlt"
              >
                <input
                  id="imageAlt"
                  name="imageAlt"
                  type="text"
                  required
                  maxLength={500}
                  defaultValue={
                    hero.imageAlt
                  }
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField
                label="Image Badge"
                htmlFor="imageBadge"
              >
                <input
                  id="imageBadge"
                  name="imageBadge"
                  type="text"
                  required
                  maxLength={120}
                  defaultValue={
                    hero.imageBadge
                  }
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField
                label="Image Title"
                htmlFor="imageTitle"
              >
                <input
                  id="imageTitle"
                  name="imageTitle"
                  type="text"
                  required
                  maxLength={255}
                  defaultValue={
                    hero.imageTitle
                  }
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField
                label="Image Subtitle"
                htmlFor="imageSubtitle"
              >
                <input
                  id="imageSubtitle"
                  name="imageSubtitle"
                  type="text"
                  required
                  maxLength={255}
                  defaultValue={
                    hero.imageSubtitle
                  }
                  className={
                    inputClass
                  }
                />
              </FormField>
            </div>
          </SettingsCard>

          {/* =================================================
              FLOATING CHIPS
              ================================================= */}

          <SettingsCard
            icon={
              <Sparkles className="h-5 w-5" />
            }
            title="Floating Specification Cards"
            description="Control the three animated specification cards surrounding the Hero image."
          >
            <div className="grid gap-5 lg:grid-cols-3">
              {/* CHIP 1 */}

              <ChipEditor
                number="1"
              >
                <FormField
                  label="Title"
                  htmlFor="chip1Title"
                >
                  <input
                    id="chip1Title"
                    name="chip1Title"
                    type="text"
                    required
                    maxLength={255}
                    defaultValue={
                      hero.chip1Title
                    }
                    className={
                      inputClass
                    }
                  />
                </FormField>

                <FormField
                  label="Subtitle"
                  htmlFor="chip1Subtitle"
                >
                  <input
                    id="chip1Subtitle"
                    name="chip1Subtitle"
                    type="text"
                    required
                    maxLength={255}
                    defaultValue={
                      hero.chip1Subtitle
                    }
                    className={
                      inputClass
                    }
                  />
                </FormField>
              </ChipEditor>

              {/* CHIP 2 */}

              <ChipEditor
                number="2"
              >
                <FormField
                  label="Title"
                  htmlFor="chip2Title"
                >
                  <input
                    id="chip2Title"
                    name="chip2Title"
                    type="text"
                    required
                    maxLength={255}
                    defaultValue={
                      hero.chip2Title
                    }
                    className={
                      inputClass
                    }
                  />
                </FormField>

                <FormField
                  label="Subtitle"
                  htmlFor="chip2Subtitle"
                >
                  <input
                    id="chip2Subtitle"
                    name="chip2Subtitle"
                    type="text"
                    required
                    maxLength={255}
                    defaultValue={
                      hero.chip2Subtitle
                    }
                    className={
                      inputClass
                    }
                  />
                </FormField>
              </ChipEditor>

              {/* CHIP 3 */}

              <ChipEditor
                number="3"
              >
                <FormField
                  label="Title"
                  htmlFor="chip3Title"
                >
                  <input
                    id="chip3Title"
                    name="chip3Title"
                    type="text"
                    required
                    maxLength={255}
                    defaultValue={
                      hero.chip3Title
                    }
                    className={
                      inputClass
                    }
                  />
                </FormField>

                <FormField
                  label="Subtitle"
                  htmlFor="chip3Subtitle"
                >
                  <input
                    id="chip3Subtitle"
                    name="chip3Subtitle"
                    type="text"
                    required
                    maxLength={255}
                    defaultValue={
                      hero.chip3Subtitle
                    }
                    className={
                      inputClass
                    }
                  />
                </FormField>
              </ChipEditor>
            </div>
          </SettingsCard>

          {/* =================================================
              VISIBILITY
              ================================================= */}

          <div
            className="
              rounded-2xl
              border
              border-brand/10
              bg-white
              p-6
              shadow-[0_25px_65px_-45px_rgba(23,49,96,0.35)]
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
                  accent-[#173160]
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
                  Turning this off will eventually hide the entire
                  Hero section from the public homepage.
                </span>
              </span>
            </label>
          </div>

          {/* =================================================
              SAVE
              ================================================= */}

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
              shadow-[0_20px_55px_-30px_rgba(23,49,96,0.45)]
              backdrop-blur-xl
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <p className="text-xs text-slate-500">
              Save your changes before leaving this page.
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
                  hover:bg-brand-soft
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
        rounded-2xl
        border
        border-brand/10
        bg-white
        p-6
        shadow-[0_25px_65px_-45px_rgba(23,49,96,0.35)]
        md:p-8
      "
    >
      <div className="flex items-start gap-3">
        <div
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
        </div>

        <div>
          <h2
            className="
              font-display
              text-lg
              font-bold
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

      <div className="mt-7">
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   FLOATING CHIP EDITOR
   ========================================================= */

function ChipEditor({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-brand/10
        bg-[#f7f9fc]
        p-5
      "
    >
      <p
        className="
          mb-5
          text-xs
          font-bold
          uppercase
          tracking-wider
          text-brand
        "
      >
        Floating Card {number}
      </p>

      <div className="space-y-5">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   FORM FIELD
   ========================================================= */

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="
          mb-2
          block
          text-xs
          font-bold
          uppercase
          tracking-wider
          text-slate-600
        "
      >
        {label}
      </label>

      {children}
    </div>
  );
}

/* =========================================================
   INPUT STYLE
   ========================================================= */

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