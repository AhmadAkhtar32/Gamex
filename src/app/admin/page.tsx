import type {
  ReactNode,
} from "react";

import Link from "next/link";

import {
  ArrowUpRight,
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
  Tags,
  Wrench,
} from "lucide-react";

import {
  requireAdmin,
} from "@/lib/admin-auth";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-[#fff8f8]">
      <header className="border-b border-brand/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
              <LayoutDashboard className="h-5 w-5" />
            </div>

            <div>
              <p className="font-display text-lg font-extrabold uppercase tracking-widest text-brand-deep">
                GameX Admin
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Website Management
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-brand/15 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-brand hover:bg-brand hover:text-white"
          >
            View Website
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
            Control Center
          </p>

          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase text-brand-deep md:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            Manage GameX products, Build Your Rig, custom builds,
            categories and website content from one place.
          </p>
        </div>

        <section className="mt-10">
          <SectionTitle
            eyebrow="Store Management"
            title="Catalogue"
          />

          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <DashboardCard
              href="/admin/products"
              icon={
                <Package className="h-6 w-6" />
              }
              title="Products"
              description="Add, edit, hide and organize products."
            />

            <DashboardCard
              href="/admin/categories"
              icon={
                <Tags className="h-6 w-6" />
              }
              title="Categories"
              description="Manage categories and subcategories."
            />

            <DashboardCard
              href="/admin/builds"
              icon={
                <Monitor className="h-6 w-6" />
              }
              title="Custom Builds"
              description="Manage ready-made GameX gaming builds."
            />

            <DashboardCard
              href="/admin/pc-builder"
              icon={
                <Boxes className="h-6 w-6" />
              }
              title="Build Your Rig"
              description="Manage PC Builder settings, order, required slots and visibility."
            />
          </div>
        </section>

        <section className="mt-12">
          <SectionTitle
            eyebrow="Website Content"
            title="Content"
          />

          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <DashboardCard
              href="/admin/content/navbar"
              icon={
                <Menu className="h-6 w-6" />
              }
              title="Navbar"
              description="Manage logo, links and navigation CTA."
            />

            <DashboardCard
              href="/admin/content/hero"
              icon={
                <PanelsTopLeft className="h-6 w-6" />
              }
              title="Hero"
              description="Manage homepage hero text and media."
            />

            <DashboardCard
              href="/admin/content/features"
              icon={
                <Sparkles className="h-6 w-6" />
              }
              title="Features"
              description="Manage homepage feature cards."
            />

            <DashboardCard
              href="/admin/content/stats"
              icon={
                <Wrench className="h-6 w-6" />
              }
              title="Stats"
              description="Manage homepage statistics."
            />

            <DashboardCard
              href="/admin/blog"
              icon={
                <BookOpen className="h-6 w-6" />
              }
              title="Blog"
              description="Create and manage blog content."
            />

            <DashboardCard
              href="/admin/content/contact"
              icon={
                <ContactRound className="h-6 w-6" />
              }
              title="Contact"
              description="Manage contact section and social links."
            />

            <DashboardCard
              href="/admin/content/footer"
              icon={
                <Footprints className="h-6 w-6" />
              }
              title="Footer"
              description="Manage footer content and links."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">
        {eyebrow}
      </p>

      <h2 className="mt-1 font-display text-2xl font-extrabold uppercase text-brand-deep">
        {title}
      </h2>
    </div>
  );
}

function DashboardCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={
        href
      }
      className="group rounded-2xl border border-brand/10 bg-white p-6 transition-all hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_22px_55px_-38px_rgba(230,0,0,0.45)]"
    >
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand/[0.08] text-brand transition-colors group-hover:bg-brand group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-5 font-display text-lg font-extrabold uppercase text-brand-deep">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand">
        Manage

        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  );
}