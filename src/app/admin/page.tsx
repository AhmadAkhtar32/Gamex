import type {
  ReactNode,
} from "react";

import Link from "next/link";

import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Boxes,
  ContactRound,
  Footprints,
  LayoutDashboard,
  Menu,
  Monitor,
  Package,
  PanelsTopLeft,
  Sparkles,
  Wrench,
} from "lucide-react";

import {
  requireAdmin,
} from "@/lib/admin-auth";

/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

export default async function AdminPage() {
  await requireAdmin();

  return (
    <main
      className="
        min-h-screen
        bg-[#f7f9fc]
      "
    >
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
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  grid
                  h-10
                  w-10
                  place-items-center
                  rounded-xl
                  bg-brand
                  text-white
                "
              >
                <LayoutDashboard className="h-5 w-5" />
              </div>

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
                  Website Management
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/"
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
            View Website

            <ArrowUpRight className="h-4 w-4" />
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
            Control Center
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
            Admin Dashboard
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
            Manage Gamex products, custom builds and website
            content from one place.
          </p>
        </div>

        {/* ===================================================
            SUMMARY
            =================================================== */}

        <div
          className="
            mt-8
            grid
            gap-4
            sm:grid-cols-3
          "
        >
          <SummaryCard
            value="2"
            label="Catalogue Areas"
          />

          <SummaryCard
            value="7"
            label="Content Areas"
          />

          <SummaryCard
            value="9"
            label="Management Tools"
          />
        </div>

        {/* ===================================================
            CATALOGUE
            =================================================== */}

        <section className="mt-12">
          <SectionHeading
            eyebrow="Store Management"
            title="Catalogue"
            description="Manage the hardware and custom systems displayed on the Gamex website."
          />

          <div
            className="
              mt-6
              grid
              gap-5
              md:grid-cols-2
            "
          >
            <DashboardCard
              href="/admin/products"
              icon={
                <Package className="h-6 w-6" />
              }
              title="Products"
              description="Add, edit, reorder, hide or remove gaming hardware products."
              action="Manage Products"
            />

            <DashboardCard
              href="/admin/builds"
              icon={
                <Boxes className="h-6 w-6" />
              }
              title="Custom Builds"
              description="Manage Gamex pre-built and custom gaming PC configurations."
              action="Manage Builds"
            />
          </div>
        </section>

        {/* ===================================================
            WEBSITE CONTENT
            =================================================== */}

        <section className="mt-14">
          <SectionHeading
            eyebrow="Homepage"
            title="Website Content"
            description="Edit the public content shown throughout the Gamex homepage."
          />

          <div
            className="
              mt-6
              grid
              gap-5
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {/* NAVBAR */}

            <DashboardCard
              href="/admin/content/navbar"
              icon={
                <Menu className="h-6 w-6" />
              }
              title="Navbar"
              description="Manage the Gamex logo, navigation links and main call-to-action."
              action="Edit Navbar"
            />

            {/* HERO */}

            <DashboardCard
              href="/admin/content/hero"
              icon={
                <Monitor className="h-6 w-6" />
              }
              title="Hero"
              description="Edit the main homepage headline, rotating words, image and buttons."
              action="Edit Hero"
            />

            {/* STATS */}

            <DashboardCard
              href="/admin/content/stats"
              icon={
                <BarChart3 className="h-6 w-6" />
              }
              title="Stats"
              description="Manage the performance and company statistics shown on the homepage."
              action="Manage Stats"
            />

            {/* FEATURES */}

            <DashboardCard
              href="/admin/content/features"
              icon={
                <Sparkles className="h-6 w-6" />
              }
              title="Features"
              description="Edit the Why Gamex section and its individual feature cards."
              action="Edit Features"
            />

            {/* BLOG */}

            <DashboardCard
              href="/admin/blog"
              icon={
                <BookOpen className="h-6 w-6" />
              }
              title="Blog"
              description="Publish articles, edit Blog settings, manage images and control visibility."
              action="Manage Blog"
            />

            {/* CONTACT */}

            <DashboardCard
              href="/admin/content/contact"
              icon={
                <ContactRound className="h-6 w-6" />
              }
              title="Contact"
              description="Edit contact information, form text and social media links."
              action="Edit Contact"
            />

            {/* FOOTER */}

            <DashboardCard
              href="/admin/content/footer"
              icon={
                <Footprints className="h-6 w-6" />
              }
              title="Footer"
              description="Manage Footer branding, navigation, contact details and social links."
              action="Edit Footer"
            />
          </div>
        </section>

        {/* ===================================================
            CURRENT ADMIN COVERAGE
            =================================================== */}

        <section
          className="
            mt-14
            overflow-hidden
            rounded-2xl
            border
            border-brand/10
            bg-white
          "
        >
          <div
            className="
              grid
              gap-8
              p-6
              md:grid-cols-[1fr_auto]
              md:items-center
              md:p-8
            "
          >
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
                  tracking-wider
                  text-brand
                "
              >
                <PanelsTopLeft className="h-3.5 w-3.5" />

                Admin Coverage
              </div>

              <h2
                className="
                  mt-4
                  font-display
                  text-2xl
                  font-extrabold
                  uppercase
                  text-brand-deep
                "
              >
                Core Homepage Management Complete
              </h2>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-sm
                  leading-relaxed
                  text-slate-500
                "
              >
                Products, custom builds, Navbar, Hero, Stats,
                Features, Blog, Contact and Footer can now be
                managed through the protected Gamex admin
                area.
              </p>
            </div>

            <div
              className="
                grid
                h-16
                w-16
                place-items-center
                rounded-2xl
                bg-brand/[0.08]
                text-brand
              "
            >
              <Wrench className="h-7 w-7" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   SECTION HEADING
   ========================================================= */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p
        className="
          text-xs
          font-bold
          uppercase
          tracking-[0.2em]
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

      <p
        className="
          mt-2
          max-w-xl
          text-sm
          leading-relaxed
          text-slate-500
        "
      >
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   DASHBOARD CARD
   ========================================================= */

function DashboardCard({
  href,
  icon,
  title,
  description,
  action,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  action: string;
}) {
  return (
    <Link
      href={href}
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-brand/10
        bg-white
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-brand/25
        hover:shadow-[0_24px_60px_-38px_rgba(23,49,96,0.40)]
      "
    >
      {/* ICON */}

      <div
        className="
          grid
          h-12
          w-12
          place-items-center
          rounded-xl
          bg-brand/[0.08]
          text-brand
          transition-all
          duration-300
          group-hover:bg-brand
          group-hover:text-white
        "
      >
        {icon}
      </div>

      {/* TITLE */}

      <h3
        className="
          mt-5
          font-display
          text-xl
          font-extrabold
          uppercase
          text-brand-deep
        "
      >
        {title}
      </h3>

      {/* DESCRIPTION */}

      <p
        className="
          mt-2
          min-h-[60px]
          text-sm
          leading-relaxed
          text-slate-500
        "
      >
        {description}
      </p>

      {/* ACTION */}

      <div
        className="
          mt-5
          flex
          items-center
          justify-between
          border-t
          border-brand/10
          pt-4
        "
      >
        <span
          className="
            text-xs
            font-bold
            uppercase
            tracking-wider
            text-brand
          "
        >
          {action}
        </span>

        <ArrowUpRight
          className="
            h-4
            w-4
            text-brand
            transition-transform
            duration-300
            group-hover:translate-x-1
            group-hover:-translate-y-1
          "
        />
      </div>
    </Link>
  );
}

/* =========================================================
   SUMMARY CARD
   ========================================================= */

function SummaryCard({
  value,
  label,
}: {
  value: string;
  label: string;
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
          font-display
          text-3xl
          font-extrabold
          text-brand-deep
        "
      >
        {value}
      </p>

      <p
        className="
          mt-1
          text-xs
          font-bold
          uppercase
          tracking-wider
          text-slate-400
        "
      >
        {label}
      </p>
    </div>
  );
}