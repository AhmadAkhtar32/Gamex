import Link from "next/link";

import {
  ArrowLeft,
  BadgeCheck,
  Eye,
  EyeOff,
  Gauge,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";

import {
  asc,
  eq,
} from "drizzle-orm";

import { db } from "@/db";

import {
  featuresSettings,
  homepageFeatures,
} from "@/db/schema";

import { requireAdmin } from "@/lib/admin-auth";

import {
  createDefaultFeatures,
  saveFeaturesSettings,
  toggleFeatureVisibility,
} from "./actions";

/* =========================================================
   TYPES
   ========================================================= */

type FeaturesAdminPageProps = {
  searchParams: Promise<{
    saved?: string;
    created?: string;
    updated?: string;
    initialized?: string;
    error?: string;
  }>;
};

/* =========================================================
   DEFAULT SECTION SETTINGS
   ========================================================= */

const DEFAULT_SETTINGS = {
  id: "main",

  eyebrow:
    "Why Gamex",

  title:
    "Built Different.",

  subtitle:
    "Everything we do is focused on delivering reliable, high-performance gaming hardware with the support to match.",

  isVisible: true,
};

/* =========================================================
   PAGE
   ========================================================= */

export default async function FeaturesAdminPage({
  searchParams,
}: FeaturesAdminPageProps) {
  /* =========================================================
     SECURITY
     ========================================================= */

  await requireAdmin();

  const query =
    await searchParams;

  /* =========================================================
     LOAD SECTION SETTINGS
     ========================================================= */

  const settingsRows =
    await db
      .select()
      .from(
        featuresSettings
      )
      .where(
        eq(
          featuresSettings.id,
          "main"
        )
      )
      .limit(1);

  const settings =
    settingsRows[0] ??
    DEFAULT_SETTINGS;

  /* =========================================================
     LOAD FEATURE CARDS
     ========================================================= */

  const features =
    await db
      .select()
      .from(
        homepageFeatures
      )
      .orderBy(
        asc(
          homepageFeatures.sortOrder
        ),
        asc(
          homepageFeatures.id
        )
      );

  const visibleCount =
    features.filter(
      (feature) =>
        feature.isVisible
    ).length;

  /* =========================================================
     PAGE
     ========================================================= */

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
          max-w-7xl
          px-5
          py-10
          md:px-8
          md:py-14
        "
      >
        {/* ===================================================
            PAGE TITLE
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
              Homepage
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
              Why Gamex
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
              Edit the Features section heading and manage the
              individual cards shown on the homepage.
            </p>
          </div>

          <Link
            href="/admin/content/features/new"
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

            Add Feature
          </Link>
        </div>

        {/* ===================================================
            SUCCESS MESSAGES
            =================================================== */}

        {query.saved === "1" ? (
          <SuccessMessage>
            Features section settings saved successfully.
          </SuccessMessage>
        ) : null}

        {query.created === "1" ? (
          <SuccessMessage>
            New feature card added successfully.
          </SuccessMessage>
        ) : null}

        {query.updated === "1" ? (
          <SuccessMessage>
            Feature card updated successfully.
          </SuccessMessage>
        ) : null}

        {query.initialized === "1" ? (
          <SuccessMessage>
            The six original Gamex feature cards were imported
            successfully.
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
            SECTION SETTINGS
            =================================================== */}

        <section
          className="
            mt-10
            rounded-2xl
            border
            border-brand/10
            bg-white
            p-6
            shadow-[0_25px_65px_-45px_rgba(23,49,96,0.35)]
            md:p-8
          "
        >
          <div
            className="
              flex
              flex-col
              gap-3
              border-b
              border-brand/10
              pb-6
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
                  text-brand
                "
              >
                Section Settings
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
                Heading & Visibility
              </h2>
            </div>

            <span
              className={`
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                px-3
                py-1.5
                text-xs
                font-bold

                ${
                  settings.isVisible
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }
              `}
            >
              {settings.isVisible ? (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  Section Visible
                </>
              ) : (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  Section Hidden
                </>
              )}
            </span>
          </div>

          <form
            action={
              saveFeaturesSettings
            }
            className="mt-7"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {/* EYEBROW */}

              <div>
                <label
                  htmlFor="eyebrow"
                  className={labelClass}
                >
                  Eyebrow
                </label>

                <input
                  id="eyebrow"
                  name="eyebrow"
                  type="text"
                  required
                  maxLength={255}
                  defaultValue={
                    settings.eyebrow
                  }
                  className={inputClass}
                />
              </div>

              {/* TITLE */}

              <div>
                <label
                  htmlFor="title"
                  className={labelClass}
                >
                  Section Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  maxLength={255}
                  defaultValue={
                    settings.title
                  }
                  className={inputClass}
                />
              </div>

              {/* SUBTITLE */}

              <div className="md:col-span-2">
                <label
                  htmlFor="subtitle"
                  className={labelClass}
                >
                  Section Subtitle
                </label>

                <textarea
                  id="subtitle"
                  name="subtitle"
                  required
                  rows={4}
                  defaultValue={
                    settings.subtitle
                  }
                  className={textareaClass}
                />
              </div>
            </div>

            {/* VISIBILITY */}

            <div
              className="
                mt-7
                rounded-xl
                border
                border-brand/10
                bg-[#f7f9fc]
                p-5
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
                    settings.isVisible
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
                    Show Features section on homepage
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
                    Turn this off to hide the entire Why Gamex
                    section without deleting any feature cards.
                  </span>
                </span>
              </label>
            </div>

            {/* SAVE */}

            <div
              className="
                mt-7
                flex
                justify-end
                border-t
                border-brand/10
                pt-6
              "
            >
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

                Save Section
              </button>
            </div>
          </form>
        </section>

        {/* ===================================================
            FEATURE CARDS
            =================================================== */}

        <section className="mt-10">
          <div
            className="
              flex
              flex-col
              gap-4
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
                  tracking-[0.18em]
                  text-brand
                "
              >
                Feature Cards
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
                Homepage Features
              </h2>
            </div>

            {features.length > 0 ? (
              <div
                className="
                  flex
                  gap-3
                  text-xs
                  font-semibold
                  text-slate-500
                "
              >
                <span>
                  Total: {features.length}
                </span>

                <span>
                  Visible: {visibleCount}
                </span>
              </div>
            ) : null}
          </div>

          {/* =================================================
              EMPTY DATABASE
              ================================================= */}

          {features.length === 0 ? (
            <div
              className="
                mt-6
                rounded-2xl
                border
                border-dashed
                border-brand/20
                bg-white
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
                  bg-brand/[0.07]
                  text-brand
                "
              >
                <Wrench className="h-6 w-6" />
              </div>

              <h3
                className="
                  mt-5
                  font-display
                  text-xl
                  font-bold
                  uppercase
                  text-brand-deep
                "
              >
                No Feature Cards in Database
              </h3>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-xl
                  text-sm
                  leading-relaxed
                  text-slate-500
                "
              >
                Import the six existing Gamex features so you do
                not need to recreate them manually.
              </p>

              {/* ORIGINAL FEATURE PREVIEW */}

              <div
                className="
                  mx-auto
                  mt-8
                  grid
                  max-w-5xl
                  gap-4
                  sm:grid-cols-2
                  lg:grid-cols-3
                "
              >
                <DefaultFeature
                  icon="wrench"
                  title="Custom-Built To Win"
                />

                <DefaultFeature
                  icon="shield"
                  title="Certified Components"
                />

                <DefaultFeature
                  icon="gauge"
                  title="Performance Tuning"
                />

                <DefaultFeature
                  icon="badge"
                  title="Up To 3-Year Warranty"
                />

                <DefaultFeature
                  icon="zap"
                  title="48hr Express Build"
                />

                <DefaultFeature
                  icon="refresh"
                  title="Trade-In Program"
                />
              </div>

              <div
                className="
                  mt-8
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-3
                  sm:flex-row
                "
              >
                <form
                  action={
                    createDefaultFeatures
                  }
                >
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
                    <RotateCcw className="h-4 w-4" />

                    Import Current Features
                  </button>
                </form>

                <Link
                  href="/admin/content/features/new"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
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
                    hover:border-brand
                    hover:bg-brand/[0.05]
                  "
                >
                  <Plus className="h-4 w-4" />

                  Add Manually
                </Link>
              </div>
            </div>
          ) : (
            /* =================================================
               FEATURES TABLE
               ================================================= */

            <div
              className="
                mt-6
                overflow-hidden
                rounded-2xl
                border
                border-brand/10
                bg-white
                shadow-[0_20px_55px_-42px_rgba(23,49,96,0.35)]
              "
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-[#f7f9fc]">
                    <tr
                      className="
                        text-left
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      <th className="px-5 py-4">
                        Feature
                      </th>

                      <th className="px-5 py-4">
                        Icon
                      </th>

                      <th className="px-5 py-4">
                        Order
                      </th>

                      <th className="px-5 py-4">
                        Status
                      </th>

                      <th className="px-5 py-4">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {features.map(
                      (feature) => (
                        <tr
                          key={
                            feature.id
                          }
                          className="
                            border-t
                            border-brand/[0.08]
                            transition-colors
                            hover:bg-[#fafbfd]
                          "
                        >
                          {/* FEATURE */}

                          <td className="px-5 py-5">
                            <div className="max-w-lg">
                              <p
                                className="
                                  font-semibold
                                  text-brand-deep
                                "
                              >
                                {
                                  feature.title
                                }
                              </p>

                              <p
                                className="
                                  mt-1
                                  line-clamp-2
                                  text-xs
                                  leading-relaxed
                                  text-slate-500
                                "
                              >
                                {
                                  feature.description
                                }
                              </p>
                            </div>
                          </td>

                          {/* ICON */}

                          <td className="px-5 py-5">
                            <div
                              className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-lg
                                bg-brand/[0.06]
                                px-3
                                py-2
                                text-xs
                                font-bold
                                text-brand
                              "
                            >
                              <FeatureIcon
                                icon={
                                  feature.icon
                                }
                              />

                              {
                                feature.icon
                              }
                            </div>
                          </td>

                          {/* ORDER */}

                          <td
                            className="
                              px-5
                              py-5
                              text-sm
                              text-slate-500
                            "
                          >
                            {
                              feature.sortOrder
                            }
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-5">
                            {feature.isVisible ? (
                              <span
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-full
                                  bg-emerald-50
                                  px-3
                                  py-1.5
                                  text-xs
                                  font-bold
                                  text-emerald-700
                                "
                              >
                                <Eye className="h-3.5 w-3.5" />

                                Visible
                              </span>
                            ) : (
                              <span
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-full
                                  bg-slate-100
                                  px-3
                                  py-1.5
                                  text-xs
                                  font-bold
                                  text-slate-500
                                "
                              >
                                <EyeOff className="h-3.5 w-3.5" />

                                Hidden
                              </span>
                            )}
                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-5">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* EDIT */}

                              <Link
                                href={`/admin/content/features/${feature.id}/edit`}
                                className="
                                  inline-flex
                                  items-center
                                  gap-1.5
                                  rounded-lg
                                  border
                                  border-brand/15
                                  bg-white
                                  px-3
                                  py-2
                                  text-xs
                                  font-bold
                                  text-brand
                                  transition-all
                                  hover:border-brand
                                  hover:bg-brand/[0.05]
                                "
                              >
                                <Pencil className="h-3.5 w-3.5" />

                                Edit
                              </Link>

                              {/* VISIBILITY */}

                              <form
                                action={
                                  toggleFeatureVisibility
                                }
                              >
                                <input
                                  type="hidden"
                                  name="featureId"
                                  value={
                                    feature.id
                                  }
                                />

                                <input
                                  type="hidden"
                                  name="nextVisibility"
                                  value={
                                    feature.isVisible
                                      ? "false"
                                      : "true"
                                  }
                                />

                                <button
                                  type="submit"
                                  className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    border
                                    border-brand/15
                                    bg-white
                                    px-3
                                    py-2
                                    text-xs
                                    font-bold
                                    text-brand
                                    transition-all
                                    hover:border-brand
                                    hover:bg-brand/[0.05]
                                  "
                                >
                                  {feature.isVisible ? (
                                    <>
                                      <EyeOff className="h-3.5 w-3.5" />

                                      Hide
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="h-3.5 w-3.5" />

                                      Show
                                    </>
                                  )}
                                </button>
                              </form>

                              {/* DELETE PLACEHOLDER */}

                              <span
                                className="
                                  rounded-lg
                                  border
                                  border-red-100
                                  bg-red-50
                                  px-3
                                  py-2
                                  text-xs
                                  font-bold
                                  text-red-400
                                "
                                title="Delete confirmation component comes next"
                              >
                                Delete
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
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
  children: React.ReactNode;
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
   DEFAULT FEATURE PREVIEW
   ========================================================= */

function DefaultFeature({
  icon,
  title,
}: {
  icon: string;
  title: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-brand/10
        bg-[#f7f9fc]
        p-4
        text-left
      "
    >
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
        <FeatureIcon
          icon={icon}
        />
      </div>

      <p
        className="
          text-sm
          font-bold
          text-brand-deep
        "
      >
        {title}
      </p>
    </div>
  );
}

/* =========================================================
   FEATURE ICON
   ========================================================= */

function FeatureIcon({
  icon,
}: {
  icon: string;
}) {
  const className =
    "h-4 w-4";

  switch (icon) {
    case "wrench":
      return (
        <Wrench
          className={
            className
          }
        />
      );

    case "shield":
      return (
        <ShieldCheck
          className={
            className
          }
        />
      );

    case "gauge":
      return (
        <Gauge
          className={
            className
          }
        />
      );

    case "badge":
      return (
        <BadgeCheck
          className={
            className
          }
        />
      );

    case "zap":
      return (
        <Zap
          className={
            className
          }
        />
      );

    case "refresh":
      return (
        <RefreshCw
          className={
            className
          }
        />
      );

    default:
      return (
        <Wrench
          className={
            className
          }
        />
      );
  }
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

const textareaClass = `
  w-full
  resize-y
  rounded-xl
  border
  border-brand/15
  bg-[#f7f9fc]
  px-4
  py-3.5
  text-sm
  leading-relaxed
  text-brand-deep
  outline-none
  transition-all
  placeholder:text-slate-400
  hover:border-brand/25
  focus:border-brand/60
  focus:bg-white
  focus:shadow-[0_0_0_3px_rgba(23,49,96,0.10)]
`;