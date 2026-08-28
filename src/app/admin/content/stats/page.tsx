import Link from "next/link";

import {
  ArrowLeft,
  BarChart3,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  RefreshCw,
} from "lucide-react";

import { asc } from "drizzle-orm";

import { db } from "@/db";
import { homepageStats } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

import {
  createDefaultStats,
  toggleStatVisibility,
} from "./actions";

import DeleteStatButton from "./DeleteStatButton";

type StatsAdminPageProps = {
  searchParams: Promise<{
    initialized?: string;
  }>;
};

export default async function StatsAdminPage({
  searchParams,
}: StatsAdminPageProps) {
  /* =========================================================
     SECURITY
     ========================================================= */

  await requireAdmin();

  const query =
    await searchParams;

  /* =========================================================
     LOAD STATS
     ========================================================= */

  const stats = await db
    .select()
    .from(homepageStats)
    .orderBy(
      asc(homepageStats.sortOrder),
      asc(homepageStats.id)
    );

  const visibleCount =
    stats.filter(
      (stat) =>
        stat.isVisible
    ).length;

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
            TITLE
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
              Statistics
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
              Manage the statistics displayed near the top of
              the Gamex homepage.
            </p>
          </div>

          <Link
            href="/admin/content/stats/new"
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

            Add Statistic
          </Link>
        </div>

        {/* ===================================================
            SUCCESS
            =================================================== */}

        {query.initialized === "1" ? (
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
            The original Gamex homepage statistics were imported
            successfully.
          </div>
        ) : null}

        {/* ===================================================
            EMPTY DATABASE
            =================================================== */}

        {stats.length === 0 ? (
          <div
            className="
              mt-10
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
              <BarChart3 className="h-6 w-6" />
            </div>

            <h2
              className="
                mt-5
                font-display
                text-xl
                font-bold
                uppercase
                text-brand-deep
              "
            >
              No Statistics in Database
            </h2>

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
              You can import the four statistics currently used
              by the Gamex website instead of entering them
              manually.
            </p>

            {/* Original stats preview */}

            <div
              className="
                mx-auto
                mt-7
                grid
                max-w-3xl
                gap-3
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >
              <DefaultStat
                value="12K+"
                label="Gamers Equipped"
              />

              <DefaultStat
                value="3.5K+"
                label="Custom Builds"
              />

              <DefaultStat
                value="48h"
                label="Avg Build Time"
              />

              <DefaultStat
                value="24/7"
                label="Tech Support"
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
                  createDefaultStats
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
                  <RefreshCw className="h-4 w-4" />

                  Import Current Website Stats
                </button>
              </form>

              <Link
                href="/admin/content/stats/new"
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
          <>
            {/* ===============================================
                SUMMARY
                =============================================== */}

            <div
              className="
                mt-10
                grid
                gap-4
                sm:grid-cols-2
              "
            >
              <SummaryCard
                label="Total Statistics"
                value={String(
                  stats.length
                )}
              />

              <SummaryCard
                label="Visible on Website"
                value={String(
                  visibleCount
                )}
              />
            </div>

            {/* ===============================================
                TABLE
                =============================================== */}

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
                <table className="w-full min-w-[900px]">
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
                        Value
                      </th>

                      <th className="px-5 py-4">
                        Label
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
                    {stats.map(
                      (stat) => (
                        <tr
                          key={
                            stat.id
                          }
                          className="
                            border-t
                            border-brand/[0.08]
                            transition-colors
                            hover:bg-[#fafbfd]
                          "
                        >
                          {/* VALUE */}

                          <td className="px-5 py-5">
                            <span
                              className="
                                font-display
                                text-2xl
                                font-extrabold
                                text-brand
                              "
                            >
                              {
                                stat.value
                              }
                            </span>
                          </td>

                          {/* LABEL */}

                          <td
                            className="
                              px-5
                              py-5
                              text-sm
                              font-semibold
                              text-brand-deep
                            "
                          >
                            {
                              stat.label
                            }
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
                              stat.sortOrder
                            }
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-5">
                            {stat.isVisible ? (
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
                                href={`/admin/content/stats/${stat.id}/edit`}
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

                              {/* SHOW / HIDE */}

                              <form
                                action={
                                  toggleStatVisibility
                                }
                              >
                                <input
                                  type="hidden"
                                  name="statId"
                                  value={
                                    stat.id
                                  }
                                />

                                <input
                                  type="hidden"
                                  name="nextVisibility"
                                  value={
                                    stat.isVisible
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
                                  {stat.isVisible ? (
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

                              {/* DELETE */}

                              <DeleteStatButton
                                statId={
                                  stat.id
                                }
                                statLabel={
                                  stat.label
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

/* =========================================================
   DEFAULT STAT PREVIEW
   ========================================================= */

function DefaultStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-brand/10
        bg-[#f7f9fc]
        px-4
        py-5
      "
    >
      <p
        className="
          font-display
          text-2xl
          font-extrabold
          text-brand
        "
      >
        {value}
      </p>

      <p
        className="
          mt-1
          text-xs
          font-semibold
          uppercase
          tracking-wider
          text-slate-500
        "
      >
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
   ========================================================= */

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
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
          text-xs
          font-bold
          uppercase
          tracking-wider
          text-slate-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          font-display
          text-3xl
          font-extrabold
          text-brand-deep
        "
      >
        {value}
      </p>
    </div>
  );
}