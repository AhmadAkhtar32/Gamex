import Link from "next/link";

import {
  ArrowLeft,
  BadgeCheck,
  Gauge,
  RefreshCw,
  Save,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { homepageFeatures } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

import { updateFeature } from "../../actions";

/* =========================================================
   TYPES
   ========================================================= */

type EditFeaturePageProps = {
  params: Promise<{
    featureId: string;
  }>;

  searchParams: Promise<{
    error?: string;
  }>;
};

/* =========================================================
   ICON OPTIONS
   ========================================================= */

const ICON_OPTIONS = [
  {
    value: "wrench",
    label: "Wrench",
    icon: Wrench,
  },
  {
    value: "shield",
    label: "Shield",
    icon: ShieldCheck,
  },
  {
    value: "gauge",
    label: "Gauge",
    icon: Gauge,
  },
  {
    value: "badge",
    label: "Badge",
    icon: BadgeCheck,
  },
  {
    value: "zap",
    label: "Zap",
    icon: Zap,
  },
  {
    value: "refresh",
    label: "Refresh",
    icon: RefreshCw,
  },
];

/* =========================================================
   PAGE
   ========================================================= */

export default async function EditFeaturePage({
  params,
  searchParams,
}: EditFeaturePageProps) {
  await requireAdmin();

  const { featureId } =
    await params;

  const query =
    await searchParams;

  const error =
    query.error;

  /* =========================================================
     PARSE ID
     ========================================================= */

  const id =
    Number.parseInt(
      featureId,
      10
    );

  if (
    !Number.isFinite(id) ||
    id <= 0
  ) {
    redirect(
      "/admin/content/features"
    );
  }

  /* =========================================================
     LOAD FEATURE
     ========================================================= */

  const rows = await db
    .select()
    .from(homepageFeatures)
    .where(
      eq(
        homepageFeatures.id,
        id
      )
    )
    .limit(1);

  const feature =
    rows[0];

  if (!feature) {
    redirect(
      "/admin/content/features"
    );
  }

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
              Edit Homepage Feature
            </p>
          </div>

          <Link
            href="/admin/content/features"
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

            Features
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
            TITLE
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
            Why Gamex
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
            Edit Feature
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
            Update this feature card&apos;s icon, title,
            description, display order, or visibility.
          </p>

          <p
            className="
              mt-2
              text-xs
              text-slate-400
            "
          >
            Feature ID: {feature.id}
          </p>
        </div>

        {/* ===================================================
            ERROR
            =================================================== */}

        {error ? (
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
            {error}
          </div>
        ) : null}

        {/* ===================================================
            CURRENT PREVIEW
            =================================================== */}

        <div
          className="
            mt-8
            rounded-2xl
            border
            border-brand/10
            bg-white
            p-6
          "
        >
          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-slate-400
            "
          >
            Current Preview
          </p>

          <div
            className="
              mt-4
              flex
              items-start
              gap-4
              rounded-xl
              border
              border-brand/10
              bg-[#f7f9fc]
              p-5
            "
          >
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
              <FeatureIcon
                icon={feature.icon}
              />
            </div>

            <div>
              <p
                className="
                  font-display
                  text-lg
                  font-extrabold
                  uppercase
                  text-brand-deep
                "
              >
                {feature.title}
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  leading-relaxed
                  text-slate-500
                "
              >
                {feature.description}
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            FORM
            =================================================== */}

        <form
          action={updateFeature}
          className="
            mt-6
            rounded-2xl
            border
            border-brand/10
            bg-white
            p-6
            shadow-[0_25px_65px_-45px_rgba(23,49,96,0.35)]
            md:p-8
          "
        >
          <input
            type="hidden"
            name="featureId"
            value={feature.id}
          />

          {/* =================================================
              ICON
              ================================================= */}

          <div>
            <p className={labelClass}>
              Choose Icon
            </p>

            <div
              className="
                mt-4
                grid
                gap-3
                sm:grid-cols-2
                md:grid-cols-3
              "
            >
              {ICON_OPTIONS.map(
                ({
                  value,
                  label,
                  icon: Icon,
                }) => (
                  <label
                    key={value}
                    className="
                      group
                      cursor-pointer
                    "
                  >
                    <input
                      type="radio"
                      name="icon"
                      value={value}
                      defaultChecked={
                        feature.icon ===
                        value
                      }
                      required
                      className="peer sr-only"
                    />

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

                        transition-all
                        duration-200

                        hover:border-brand/30
                        hover:bg-brand/[0.04]

                        peer-checked:border-brand
                        peer-checked:bg-brand/[0.08]
                        peer-checked:shadow-[0_0_0_2px_rgba(23,49,96,0.08)]
                      "
                    >
                      <div
                        className="
                          grid
                          h-11
                          w-11
                          place-items-center
                          rounded-xl
                          bg-white
                          text-brand
                          shadow-sm
                        "
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <p
                          className="
                            text-sm
                            font-bold
                            text-brand-deep
                          "
                        >
                          {label}
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-xs
                            text-slate-400
                          "
                        >
                          {value}
                        </p>
                      </div>
                    </div>
                  </label>
                )
              )}
            </div>
          </div>

          {/* =================================================
              TITLE + ORDER
              ================================================= */}

          <div
            className="
              mt-8
              grid
              gap-6
              md:grid-cols-2
            "
          >
            <div>
              <label
                htmlFor="title"
                className={labelClass}
              >
                Feature Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={255}
                defaultValue={
                  feature.title
                }
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="sortOrder"
                className={labelClass}
              >
                Display Order
              </label>

              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                min="0"
                step="1"
                defaultValue={
                  feature.sortOrder
                }
                className={inputClass}
              />

              <p
                className="
                  mt-2
                  text-xs
                  text-slate-400
                "
              >
                Lower numbers appear first.
              </p>
            </div>
          </div>

          {/* =================================================
              DESCRIPTION
              ================================================= */}

          <div className="mt-6">
            <label
              htmlFor="description"
              className={labelClass}
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              required
              rows={5}
              defaultValue={
                feature.description
              }
              className={textareaClass}
            />
          </div>

          {/* =================================================
              VISIBILITY
              ================================================= */}

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
                  feature.isVisible
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
                  Visible on website
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
                  Disable this to keep the card in Admin while
                  hiding it from the homepage.
                </span>
              </span>
            </label>
          </div>

          {/* =================================================
              ACTIONS
              ================================================= */}

          <div
            className="
              mt-8
              flex
              flex-col
              gap-3
              border-t
              border-brand/10
              pt-6
              sm:flex-row
              sm:justify-end
            "
          >
            <Link
              href="/admin/content/features"
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                border
                border-brand/15
                bg-white
                px-6
                py-3.5
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
      </div>
    </main>
  );
}

/* =========================================================
   ICON PREVIEW
   ========================================================= */

function FeatureIcon({
  icon,
}: {
  icon: string;
}) {
  const className =
    "h-5 w-5";

  switch (icon) {
    case "wrench":
      return (
        <Wrench
          className={className}
        />
      );

    case "shield":
      return (
        <ShieldCheck
          className={className}
        />
      );

    case "gauge":
      return (
        <Gauge
          className={className}
        />
      );

    case "badge":
      return (
        <BadgeCheck
          className={className}
        />
      );

    case "zap":
      return (
        <Zap
          className={className}
        />
      );

    case "refresh":
      return (
        <RefreshCw
          className={className}
        />
      );

    default:
      return (
        <Wrench
          className={className}
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