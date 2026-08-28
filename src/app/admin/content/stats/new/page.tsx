import Link from "next/link";

import {
  ArrowLeft,
  BarChart3,
  Plus,
} from "lucide-react";

import { requireAdmin } from "@/lib/admin-auth";

import { createStat } from "../actions";

/* =========================================================
   TYPES
   ========================================================= */

type NewStatPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

/* =========================================================
   PAGE
   ========================================================= */

export default async function NewStatPage({
  searchParams,
}: NewStatPageProps) {
  /* =========================================================
     SECURITY
     ========================================================= */

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
            max-w-4xl
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
              Add Homepage Statistic
            </p>
          </div>

          <Link
            href="/admin/content/stats"
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

            Statistics
          </Link>
        </div>
      </header>

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div
        className="
          mx-auto
          max-w-4xl
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
            Add Statistic
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
            Add another number or achievement to the statistics
            section of the Gamex homepage.
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
            EXAMPLE
            =================================================== */}

        <div
          className="
            mt-8
            rounded-2xl
            border
            border-brand/10
            bg-white
            p-5
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
              <BarChart3 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-brand-deep">
                Example
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                A statistic has a large value such as{" "}
                <strong>12K+</strong> and a short label such as{" "}
                <strong>Gamers Equipped</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            FORM
            =================================================== */}

        <form
          action={createStat}
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
          <div className="grid gap-6 md:grid-cols-2">
            {/* ===============================================
                VALUE
                =============================================== */}

            <div>
              <label
                htmlFor="value"
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
                Statistic Value
              </label>

              <input
                id="value"
                name="value"
                type="text"
                required
                maxLength={100}
                placeholder="e.g. 25K+"
                className={inputClass}
              />

              <p className="mt-2 text-xs text-slate-400">
                This is the large number displayed on the website.
              </p>
            </div>

            {/* ===============================================
                LABEL
                =============================================== */}

            <div>
              <label
                htmlFor="label"
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
                Statistic Label
              </label>

              <input
                id="label"
                name="label"
                type="text"
                required
                maxLength={255}
                placeholder="e.g. Happy Customers"
                className={inputClass}
              />

              <p className="mt-2 text-xs text-slate-400">
                Short text explaining what the number represents.
              </p>
            </div>

            {/* ===============================================
                DISPLAY ORDER
                =============================================== */}

            <div>
              <label
                htmlFor="sortOrder"
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

              <p className="mt-2 text-xs text-slate-400">
                Lower numbers appear first from left to right.
              </p>
            </div>
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
                  Turn this off if you want to save the statistic
                  without showing it publicly.
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
              href="/admin/content/stats"
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

              Add Statistic
            </button>
          </div>
        </form>
      </div>
    </main>
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