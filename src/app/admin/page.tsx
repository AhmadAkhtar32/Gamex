import Link from "next/link";

import type { LucideIcon } from "lucide-react";

import {
  Boxes,
  FileText,
  Gauge,
  Mail,
  MonitorCog,
  Settings,
} from "lucide-react";

import { requireAdmin } from "@/lib/admin-auth";
import { logoutAdmin } from "./actions";

export default async function AdminPage() {
  /* =========================================================
     SECURITY
     ========================================================= */

  const admin = await requireAdmin();

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      {/* =====================================================
          TOP BAR
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
          {/* Logo / title */}

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
              Website Management
            </p>
          </div>

          {/* Admin account */}

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-brand-deep">
                {admin.name}
              </p>

              <p className="text-xs text-slate-500">
                {admin.email}
              </p>
            </div>

            <form action={logoutAdmin}>
              <button
                type="submit"
                className="
                  rounded-lg
                  border
                  border-brand/15
                  bg-white
                  px-4
                  py-2.5
                  font-display
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-brand
                  transition-all
                  duration-300
                  hover:border-brand
                  hover:bg-brand
                  hover:text-white
                "
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* =====================================================
          DASHBOARD
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
            WELCOME
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
            Dashboard
          </p>

          <h1
            className="
              mt-2
              font-display
              text-3xl
              font-extrabold
              uppercase
              tracking-tight
              text-brand-deep
              md:text-4xl
            "
          >
            Welcome, {admin.name}
          </h1>

          <p
            className="
              mt-3
              max-w-2xl
              text-slate-600
            "
          >
            Manage the products, custom builds, website content,
            blog, messages and settings of the Gamex website.
          </p>
        </div>

        {/* ===================================================
            MANAGEMENT CARDS
            =================================================== */}

        <div
          className="
            mt-10
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {/* PRODUCTS */}

          <DashboardCard
            icon={Boxes}
            title="Products"
            description="Add, edit, show, hide and delete products."
            href="/admin/products"
            active
          />

          {/* CUSTOM BUILDS */}

          <DashboardCard
            icon={MonitorCog}
            title="Custom Builds"
            description="Manage Titan, Vortex, Stealth and future custom builds."
          />

          {/* WEBSITE CONTENT */}

          <DashboardCard
            icon={Gauge}
            title="Website Content"
            description="Control hero, statistics, features and homepage sections."
          />

          {/* BLOG */}

          <DashboardCard
            icon={FileText}
            title="Blog"
            description="Create, edit and manage Gamex articles."
          />

          {/* MESSAGES */}

          <DashboardCard
            icon={Mail}
            title="Messages"
            description="Read and manage customer contact-form submissions."
          />

          {/* SETTINGS */}

          <DashboardCard
            icon={Settings}
            title="Settings"
            description="Manage navigation, contact details, footer and site information."
          />
        </div>

        {/* ===================================================
            DEVELOPMENT STATUS
            =================================================== */}

        <div
          className="
            mt-10
            rounded-2xl
            border
            border-brand/10
            bg-white
            p-6
            shadow-[0_20px_55px_-38px_rgba(23,49,96,0.3)]
          "
        >
          <h2
            className="
              font-display
              text-lg
              font-bold
              uppercase
              text-brand-deep
            "
          >
            Admin System Status
          </h2>

          <div
            className="
              mt-5
              grid
              gap-3
              text-sm
              sm:grid-cols-2
            "
          >
            <StatusItem
              label="Secure login"
              completed
            />

            <StatusItem
              label="Database sessions"
              completed
            />

            <StatusItem
              label="Protected dashboard"
              completed
            />

            <StatusItem
              label="Logout"
              completed
            />

            <StatusItem
              label="Product management"
              completed
            />

            <StatusItem
              label="Custom build management"
            />

            <StatusItem
              label="Website settings"
            />

            <StatusItem
              label="Blog management"
            />

            <StatusItem
              label="Message management"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   DASHBOARD CARD
   ========================================================= */

function DashboardCard({
  icon: Icon,
  title,
  description,
  href,
  active = false,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  active?: boolean;
}) {
  const content = (
    <>
      {/* Icon */}

      <div
        className="
          grid
          h-11
          w-11
          place-items-center
          rounded-xl
          bg-brand/[0.07]
          text-brand
          transition-all
          duration-300
          group-hover:bg-brand
          group-hover:text-white
        "
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Text */}

      <h2
        className="
          mt-5
          font-display
          text-lg
          font-bold
          text-brand-deep
        "
      >
        {title}
      </h2>

      <p
        className="
          mt-2
          text-sm
          leading-relaxed
          text-slate-500
        "
      >
        {description}
      </p>

      {/* Status */}

      <div
        className="
          mt-5
          border-t
          border-brand/[0.08]
          pt-4
        "
      >
        {active ? (
          <span
            className="
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-brand
            "
          >
            Open Management →
          </span>
        ) : (
          <span
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-slate-400
            "
          >
            Coming Next
          </span>
        )}
      </div>
    </>
  );

  /* =======================================================
     CLICKABLE CARD
     ======================================================= */

  if (href) {
    return (
      <Link
        href={href}
        className="
          group
          block
          rounded-2xl
          border
          border-brand/10
          bg-white
          p-6
          shadow-[0_18px_50px_-38px_rgba(23,49,96,0.32)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-brand/25
          hover:shadow-[0_26px_60px_-38px_rgba(23,49,96,0.42)]
        "
      >
        {content}
      </Link>
    );
  }

  /* =======================================================
     NON-CLICKABLE CARD
     ======================================================= */

  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-brand/10
        bg-white
        p-6
        opacity-80
        shadow-[0_18px_50px_-38px_rgba(23,49,96,0.25)]
      "
    >
      {content}
    </div>
  );
}

/* =========================================================
   STATUS ITEM
   ========================================================= */

function StatusItem({
  label,
  completed = false,
}: {
  label: string;
  completed?: boolean;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-xl
        bg-[#f7f9fc]
        px-4
        py-3
      "
    >
      <span
        className={`
          h-2.5
          w-2.5
          shrink-0
          rounded-full

          ${
            completed
              ? "bg-emerald-500"
              : "bg-slate-300"
          }
        `}
      />

      <span
        className={
          completed
            ? "font-medium text-slate-700"
            : "text-slate-500"
        }
      >
        {label}
      </span>
    </div>
  );
}