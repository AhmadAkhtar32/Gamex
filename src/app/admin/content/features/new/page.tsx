import Link from "next/link";

import {
  ArrowLeft,
  BadgeCheck,
  Gauge,
  Plus,
  RefreshCw,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";

import { requireAdmin } from "@/lib/admin-auth";

import { createFeature } from "../actions";

/* =========================================================
   TYPES
   ========================================================= */

type NewFeaturePageProps = {
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

export default async function NewFeaturePage({
  searchParams,
}: NewFeaturePageProps) {
  await requireAdmin();

  const query =
    await searchParams;

  const error =
    query.error;

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
              Add Homepage Feature
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
            Add Feature
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
            Add another benefit or service card to the Why Gamex
            section on the homepage.
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
            FORM
            =================================================== */}

        <form
          action={createFeature}
          className="
            mt-8
            rounded-2xl
            border
            border-brand/10
            bg-white
            p-6
            shadow-[0_25px_65px_-45px_rgba(23,49,96,0.35)]
            md:p-8
          "
        >
          {/* =================================================
              ICON
              ================================================= */}

          <div>
            <p className={labelClass}>
              Choose Icon
            </p>

            <p
              className="
                mb-4
                text-xs
                leading-relaxed
                text-slate-400
              "
            >
              Select the icon that best represents this feature.
            </p>

            <div
              className="
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
                      relative
                      cursor-pointer
                    "
                  >
                    <input
                      type="radio"
                      name="icon"
                      value={value}
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

                          transition-all

                          peer-checked:bg-brand
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
            {/* TITLE */}

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
                placeholder="e.g. Lifetime Support"
                className={inputClass}
              />
            </div>

            {/* ORDER */}

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
                defaultValue="0"
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
              placeholder="Explain this feature or service..."
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
                defaultChecked
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
                  Disable this if you want to save the feature
                  without publishing it yet.
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
              <Plus className="h-4 w-4" />

              Add Feature
            </button>
          </div>
        </form>
      </div>
    </main>
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