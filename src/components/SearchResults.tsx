"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";

import {
  DetailsModal,
  type DetailsModalItem,
} from "@/components/DetailsModal";

import { formatPrice } from "@/lib/price";

export type SearchResult = {
  id: string;
  type: "product" | "build" | "article" | "category" | "page";
  title: string;
  description: string;
  image?: string;
  href?: string;
  details?: DetailsModalItem;
};

const labels: Record<SearchResult["type"], string> = {
  product: "Product",
  build: "Custom Build",
  article: "Blog Article",
  category: "Category",
  page: "Website Page",
};

export function SearchResults({
  results,
  query,
}: {
  results: SearchResult[];
  query: string;
}) {
  const [selected, setSelected] =
    useState<DetailsModalItem | null>(null);

  if (!query) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <Search className="mx-auto h-8 w-8 text-red-600" />

        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          What are you looking for?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Search for a product, component, custom build, category or article.
        </p>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h2 className="text-lg font-semibold text-slate-900">
          No results found
        </h2>

        <p className="mt-2 break-words text-sm leading-6 text-slate-500">
          No matches for “{query}”. Try a shorter name, brand or category.
        </p>

        <Link
          href="/#products"
          className="mt-5 inline-flex rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mb-5 break-words text-sm text-slate-500">
        Showing {results.length} results for{" "}
        <span className="font-semibold text-slate-900">
          “{query}”
        </span>
      </p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((result) => (
          <article
            key={result.id}
            className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            {result.image && (
              <div className="flex h-48 items-center justify-center border-b border-slate-100 bg-slate-50 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.image}
                  alt={result.title}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </div>
            )}

            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                {labels[result.type]}
              </p>

              <h2 className="mt-2 break-words text-lg font-bold text-slate-900">
                {result.title}
              </h2>

              <p className="mt-3 line-clamp-3 break-words text-sm leading-6 text-slate-500">
                {result.description}
              </p>

              {result.details && (
                <div className="mt-4 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-bold text-white">
                  {formatPrice(result.details.price)}
                </div>
              )}

              <div className="mt-auto pt-5">
                {result.details ? (
                  <button
                    type="button"
                    onClick={() =>
                      setSelected(result.details ?? null)
                    }
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                  >
                    View details
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                ) : result.href ? (
                  <Link
                    href={result.href}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                  >
                    {result.type === "article"
                      ? "Read article"
                      : "Explore"}

                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      <DetailsModal
        item={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}