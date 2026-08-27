import Link from "next/link";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  MonitorCog,
  Pencil,
  Plus,
} from "lucide-react";

import { asc } from "drizzle-orm";

import { db } from "@/db";
import { customBuilds } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

import {
  toggleBuildVisibility,
} from "./actions";

import DeleteBuildButton from "./DeleteBuildButton";

export default async function AdminBuildsPage() {
  /* =========================================================
     SECURITY
     ========================================================= */

  await requireAdmin();

  /* =========================================================
     LOAD BUILDS
     ========================================================= */

  const buildList = await db
    .select()
    .from(customBuilds)
    .orderBy(
      asc(customBuilds.sortOrder),
      asc(customBuilds.name)
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
              Custom Build Management
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
              Signature Systems
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
              Custom Builds
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
              Add, edit, show, hide and delete the custom gaming
              systems displayed on the Gamex website.
            </p>
          </div>

          <Link
            href="/admin/builds/new"
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

            Add Build
          </Link>
        </div>

        {/* ===================================================
            EMPTY STATE
            =================================================== */}

        {buildList.length === 0 ? (
          <div
            className="
              mt-10
              rounded-2xl
              border
              border-dashed
              border-brand/20
              bg-white
              px-6
              py-16
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
              <MonitorCog className="h-6 w-6" />
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
              No Custom Builds Yet
            </h2>

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
              Add your first custom build using the button above.
            </p>

            <Link
              href="/admin/builds/new"
              className="
                mt-6
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
              <Plus className="h-4 w-4" />

              Add First Build
            </Link>
          </div>
        ) : (
          /* =================================================
             BUILDS TABLE
             ================================================= */

          <div
            className="
              mt-10
              overflow-hidden
              rounded-2xl
              border
              border-brand/10
              bg-white
              shadow-[0_20px_55px_-42px_rgba(23,49,96,0.35)]
            "
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px]">
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
                      Build
                    </th>

                    <th className="px-5 py-4">
                      Role
                    </th>

                    <th className="px-5 py-4">
                      Badge
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
                  {buildList.map((build) => (
                    <tr
                      key={build.id}
                      className="
                        border-t
                        border-brand/[0.08]
                        transition-colors
                        hover:bg-[#fafbfd]
                      "
                    >
                      {/* BUILD */}

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <div
                            className="
                              h-16
                              w-20
                              shrink-0
                              overflow-hidden
                              rounded-xl
                              border
                              border-brand/10
                              bg-[#f7f9fc]
                            "
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={build.image}
                              alt={build.name}
                              className="
                                h-full
                                w-full
                                object-cover
                              "
                            />
                          </div>

                          <div className="min-w-0">
                            <p
                              className="
                                max-w-[220px]
                                truncate
                                font-semibold
                                text-brand-deep
                              "
                            >
                              {build.name}
                            </p>

                            <p
                              className="
                                mt-1
                                max-w-[220px]
                                truncate
                                text-xs
                                text-slate-400
                              "
                            >
                              {build.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ROLE */}

                      <td
                        className="
                          px-5
                          py-5
                          text-sm
                          text-slate-600
                        "
                      >
                        {build.role}
                      </td>

                      {/* BADGE */}

                      <td className="px-5 py-5">
                        <span
                          className="
                            inline-flex
                            rounded-full
                            bg-brand/[0.07]
                            px-3
                            py-1.5
                            text-xs
                            font-bold
                            uppercase
                            text-brand
                          "
                        >
                          {build.badge}
                        </span>
                      </td>

                      {/* ORDER */}

                      <td
                        className="
                          px-5
                          py-5
                          text-sm
                          font-medium
                          text-slate-600
                        "
                      >
                        {build.sortOrder}
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-5">
                        {build.isVisible ? (
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
                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                          "
                        >
                          {/* EDIT */}

                          <Link
                            href={`/admin/builds/${build.id}/edit`}
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
                              toggleBuildVisibility
                            }
                          >
                            <input
                              type="hidden"
                              name="buildId"
                              value={build.id}
                            />

                            <input
                              type="hidden"
                              name="nextVisibility"
                              value={
                                build.isVisible
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
                              {build.isVisible ? (
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

                          <DeleteBuildButton
                            buildId={build.id}
                            buildName={
                              build.name
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================================================
            COUNTS
            =================================================== */}

        <div
          className="
            mt-4
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
          "
        >
          <p className="text-xs text-slate-400">
            {buildList.length}{" "}
            {buildList.length === 1
              ? "build"
              : "builds"}{" "}
            in database
          </p>

          <p className="text-xs text-slate-400">
            {
              buildList.filter(
                (build) =>
                  build.isVisible
              ).length
            }{" "}
            visible on website
          </p>
        </div>
      </div>
    </main>
  );
}