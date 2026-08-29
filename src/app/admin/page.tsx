import Link from "next/link";

import {
  ArrowUpRight,
  BarChart3,
  Boxes,
  ContactRound,
  FileImage,
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
   DASHBOARD ITEMS
   ========================================================= */

const catalogueItems = [
  {
    title: "Products",
    description:
      "Manage gaming components, categories, specifications, images and visibility.",
    href: "/admin/products",
    icon: Package,
    eyebrow: "Catalogue",
  },

  {
    title: "Custom Builds",
    description:
      "Manage pre-built gaming PCs, specifications, images and display order.",
    href: "/admin/builds",
    icon: Boxes,
    eyebrow: "Catalogue",
  },
];

const homepageItems = [
  {
    title: "Navbar",
    description:
      "Control branding, logo, CTA and every navigation link shown at the top of the website.",
    href: "/admin/content/navbar",
    icon: Menu,
    eyebrow: "Website Chrome",
  },

  {
    title: "Hero",
    description:
      "Edit the main homepage headline, rotating text, buttons, trust points and hero artwork.",
    href: "/admin/content/hero",
    icon: FileImage,
    eyebrow: "Homepage",
  },

  {
    title: "Stats",
    description:
      "Manage homepage statistics such as gamers equipped, builds and support figures.",
    href: "/admin/content/stats",
    icon: BarChart3,
    eyebrow: "Homepage",
  },

  {
    title: "Why Gamex",
    description:
      "Manage the feature cards, icons and section heading used to explain why customers choose Gamex.",
    href: "/admin/content/features",
    icon: Sparkles,
    eyebrow: "Homepage",
  },

  {
    title: "Contact",
    description:
      "Edit contact information, form labels, social profiles and section visibility.",
    href: "/admin/content/contact",
    icon: ContactRound,
    eyebrow: "Homepage",
  },

  {
    title: "Footer",
    description:
      "Manage footer branding, navigation, contact details, social profiles, CTA and copyright.",
    href: "/admin/content/footer",
    icon: Footprints,
    eyebrow: "Website Chrome",
  },
];

/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

export default async function AdminPage() {
  /*
   * Protect the entire dashboard.
   */
  await requireAdmin();

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      {/* =====================================================
          TOP BAR
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
            gap-5
            px-5
            py-4
            md:px-8
          "
        >
          {/* BRAND */}

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
                shadow-[0_12px_28px_-14px_rgba(23,49,96,0.65)]
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

              <p className="mt-0.5 text-xs text-slate-500">
                Website Management
              </p>
            </div>
          </div>

          {/* VIEW WEBSITE */}

          <Link
            href="/"
            target="_blank"
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
            <Monitor className="h-4 w-4" />

            <span className="hidden sm:inline">
              View Website
            </span>

            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* =====================================================
          PAGE CONTENT
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
            PAGE HEADING
            =================================================== */}

        <div
          className="
            max-w-3xl
          "
        >
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
              leading-tight
              text-brand-deep
              md:text-4xl
            "
          >
            Website Dashboard
          </h1>

          <p
            className="
              mt-4
              max-w-2xl
              text-sm
              leading-relaxed
              text-slate-500
              md:text-base
            "
          >
            Manage the Gamex catalogue and homepage content
            from one central admin panel.
          </p>
        </div>

        {/* ===================================================
            QUICK SUMMARY
            =================================================== */}

        <div
          className="
            mt-8
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          <SummaryCard
            icon={
              <Package className="h-5 w-5" />
            }
            value="2"
            label="Catalogue Areas"
          />

          <SummaryCard
            icon={
              <PanelsTopLeft className="h-5 w-5" />
            }
            value="6"
            label="Content Areas"
          />

          <SummaryCard
            icon={
              <Wrench className="h-5 w-5" />
            }
            value="8"
            label="Management Tools"
          />
        </div>

        {/* ===================================================
            CATALOGUE MANAGEMENT
            =================================================== */}

        <section className="mt-12">
          <SectionHeading
            eyebrow="Store"
            title="Catalogue Management"
            description="Create and manage the hardware and custom systems shown to customers."
          />

          <div
            className="
              mt-6
              grid
              gap-5
              md:grid-cols-2
            "
          >
            {catalogueItems.map(
              (item) => (
                <DashboardCard
                  key={item.href}
                  {...item}
                />
              )
            )}
          </div>
        </section>

        {/* ===================================================
            WEBSITE CONTENT
            =================================================== */}

        <section className="mt-14">
          <SectionHeading
            eyebrow="Content"
            title="Website Content"
            description="Control the individual sections that make up the public Gamex website."
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
            {homepageItems.map(
              (item) => (
                <DashboardCard
                  key={item.href}
                  {...item}
                />
              )
            )}
          </div>
        </section>

        {/* ===================================================
            HELP PANEL
            =================================================== */}

        <div
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
              flex
              flex-col
              gap-5
              p-6
              md:flex-row
              md:items-center
              md:justify-between
              md:p-8
            "
          >
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
                Public Website
              </p>

              <h2
                className="
                  mt-2
                  font-display
                  text-xl
                  font-extrabold
                  uppercase
                  text-brand-deep
                  md:text-2xl
                "
              >
                Preview Your Changes
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
                After saving content in any section, open the
                public website to verify the result.
              </p>
            </div>

            <Link
              href="/"
              target="_blank"
              className="
                inline-flex
                shrink-0
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
              Open Website

              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
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
          max-w-2xl
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
  title,
  description,
  href,
  icon: Icon,
  eyebrow,
}: {
  title: string;
  description: string;
  href: string;
  icon: typeof Package;
  eyebrow: string;
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
        hover:border-brand/30
        hover:shadow-[0_22px_48px_-32px_rgba(23,49,96,0.4)]
      "
    >
      {/* DECORATION */}

      <div
        className="
          pointer-events-none
          absolute
          -right-14
          -top-14
          h-36
          w-36
          rounded-full
          bg-brand/[0.04]
          transition-transform
          duration-500
          group-hover:scale-125
        "
      />

      {/* ICON */}

      <div
        className="
          relative
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
        <Icon className="h-5 w-5" />
      </div>

      {/* CONTENT */}

      <div className="relative mt-5">
        <p
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-brand
          "
        >
          {eyebrow}
        </p>

        <h3
          className="
            mt-2
            font-display
            text-xl
            font-extrabold
            uppercase
            text-brand-deep
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-3
            min-h-[66px]
            text-sm
            leading-relaxed
            text-slate-500
          "
        >
          {description}
        </p>

        <div
          className="
            mt-5
            flex
            items-center
            gap-2
            text-xs
            font-bold
            uppercase
            tracking-wider
            text-brand
          "
        >
          Manage

          <ArrowUpRight
            className="
              h-4
              w-4
              transition-transform
              duration-300
              group-hover:translate-x-1
              group-hover:-translate-y-1
            "
          />
        </div>
      </div>
    </Link>
  );
}

/* =========================================================
   SUMMARY CARD
   ========================================================= */

function SummaryCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-4
        rounded-2xl
        border
        border-brand/10
        bg-white
        p-5
      "
    >
      <div
        className="
          grid
          h-11
          w-11
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
        <p
          className="
            font-display
            text-2xl
            font-extrabold
            text-brand-deep
          "
        >
          {value}
        </p>

        <p
          className="
            mt-0.5
            text-xs
            font-semibold
            uppercase
            tracking-wider
            text-slate-400
          "
        >
          {label}
        </p>
      </div>
    </div>
  );
}