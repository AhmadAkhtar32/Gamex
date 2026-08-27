import type { ReactNode } from "react";

import Link from "next/link";

import {
  ArrowLeft,
  ImageIcon,
  LinkIcon,
  ListChecks,
  MonitorCog,
  Tag,
  Upload,
} from "lucide-react";

import { requireAdmin } from "@/lib/admin-auth";
import { createBuild } from "../actions";

type NewBuildPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewBuildPage({
  searchParams,
}: NewBuildPageProps) {
  await requireAdmin();

  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      {/* Header */}

      <header className="border-b border-brand/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div>
            <p className="font-display text-lg font-extrabold uppercase tracking-widest text-brand-deep">
              Gamex Admin
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              Add Custom Build
            </p>
          </div>

          <Link
            href="/admin/builds"
            className="inline-flex items-center gap-2 rounded-lg border border-brand/15 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-brand transition-all hover:border-brand hover:bg-brand hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Builds
          </Link>
        </div>
      </header>

      {/* Main content */}

      <div className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
            Signature Systems
          </p>

          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase text-brand-deep md:text-4xl">
            Add Custom Build
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            Add a custom gaming system to Gamex. The build image
            can be uploaded from your computer or supplied using
            an image URL.
          </p>
        </div>

        {/* Error */}

        {error ? (
          <div className="mt-7 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        {/* Form */}

        <form
          action={createBuild}
          className="mt-8 rounded-2xl border border-brand/10 bg-white p-6 shadow-[0_25px_65px_-45px_rgba(23,49,96,0.35)] md:p-8"
        >
          {/* Basic details */}

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              label="Build Name"
              htmlFor="name"
            >
              <input
                id="name"
                name="name"
                type="text"
                required
                maxLength={255}
                placeholder="e.g. Titan X"
                className={inputClass}
              />
            </FormField>

            <FormField
              label="Build Role"
              htmlFor="role"
            >
              <input
                id="role"
                name="role"
                type="text"
                required
                maxLength={255}
                placeholder="e.g. Ultimate 4K Gaming"
                className={inputClass}
              />

              <p className="mt-2 text-xs text-slate-400">
                This appears directly below the build name.
              </p>
            </FormField>

            <FormField
              label="Badge"
              htmlFor="badge"
            >
              <div className="relative">
                <Tag className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="badge"
                  name="badge"
                  type="text"
                  maxLength={120}
                  placeholder="e.g. FLAGSHIP"
                  className={`${inputClass} pl-11`}
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Leave empty to use CUSTOM BUILD.
              </p>
            </FormField>

            <FormField
              label="Display Order"
              htmlFor="sortOrder"
            >
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
                Lower numbers appear first.
              </p>
            </FormField>
          </div>

          {/* Description */}

          <div className="mt-6">
            <FormField
              label="Description"
              htmlFor="description"
            >
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                placeholder="Describe this custom gaming build..."
                className={`${inputClass} resize-y`}
              />
            </FormField>
          </div>

          {/* Specifications */}

          <div className="mt-6">
            <FormField
              label="Specifications"
              htmlFor="specs"
            >
              <div className="relative">
                <ListChecks className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />

                <textarea
                  id="specs"
                  name="specs"
                  required
                  rows={7}
                  placeholder={`RTX 5090
Ryzen 9 9950X3D
64GB DDR5
4TB NVMe SSD
1200W Platinum PSU`}
                  className={`${inputClass} resize-y pl-11`}
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Enter one specification per line.
              </p>
            </FormField>
          </div>

          {/* Image */}

          <div className="mt-8 rounded-2xl border border-brand/10 bg-[#f7f9fc] p-5 md:p-6">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/[0.08] text-brand">
                <ImageIcon className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-display text-base font-bold uppercase text-brand-deep">
                  Build Image
                </h2>

                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Upload an image from your PC or use an external
                  image URL.
                </p>
              </div>
            </div>

            {/* Upload from PC */}

            <div className="mt-6">
              <label
                htmlFor="imageFile"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                Upload From PC
              </label>

              <div className="rounded-xl border border-dashed border-brand/25 bg-white p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand/[0.08] text-brand">
                    <Upload className="h-5 w-5" />
                  </div>

                  <p className="mt-3 text-sm font-bold text-brand-deep">
                    Choose Build Image
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    JPG, PNG or WebP — maximum 5 MB
                  </p>

                  <input
                    id="imageFile"
                    name="imageFile"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="
                      mt-4
                      block
                      max-w-full
                      text-xs
                      text-slate-500

                      file:mr-4
                      file:rounded-lg
                      file:border-0
                      file:bg-brand
                      file:px-4
                      file:py-2.5
                      file:text-xs
                      file:font-bold
                      file:text-white

                      hover:file:bg-brand-soft
                    "
                  />
                </div>
              </div>
            </div>

            {/* OR */}

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-brand/10" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Or
              </span>

              <div className="h-px flex-1 bg-brand/10" />
            </div>

            {/* Image URL */}

            <FormField
              label="Image URL"
              htmlFor="imageUrl"
            >
              <div className="relative">
                <LinkIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  maxLength={1000}
                  placeholder="https://example.com/build-image.jpg"
                  className={`${inputClass} bg-white pl-11`}
                />
              </div>

              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                You only need one image method. If you provide
                both, the uploaded PC image will be used.
              </p>
            </FormField>
          </div>

          {/* Visibility */}

          <div className="mt-7 rounded-xl border border-brand/10 bg-[#f7f9fc] p-5">
            <label
              htmlFor="isVisible"
              className="flex cursor-pointer items-start gap-3"
            >
              <input
                id="isVisible"
                name="isVisible"
                type="checkbox"
                defaultChecked
                className="mt-1 h-4 w-4 accent-[#173160]"
              />

              <span>
                <span className="block text-sm font-bold text-brand-deep">
                  Visible on website
                </span>

                <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                  Turn this off if you want to keep the build in
                  the admin panel without displaying it publicly.
                </span>
              </span>
            </label>
          </div>

          {/* Buttons */}

          <div className="mt-8 flex flex-col gap-3 border-t border-brand/10 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/admin/builds"
              className="inline-flex items-center justify-center rounded-xl border border-brand/15 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-brand transition-all hover:border-brand hover:bg-brand/[0.05]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:bg-brand-soft"
            >
              <MonitorCog className="h-4 w-4" />
              Save Build
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600"
      >
        {label}
      </label>

      {children}
    </div>
  );
}

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