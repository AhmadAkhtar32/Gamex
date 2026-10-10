"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowUpRight, LoaderCircle, Search, X } from "lucide-react";
import { DetailsModal, type DetailsModalItem } from "@/components/DetailsModal";
import type { SearchResult } from "@/components/SearchResults";
import { formatPrice } from "@/lib/price";

const labels: Record<SearchResult["type"], string> = {
  product: "Product",
  build: "Custom Build",
  article: "Article",
  category: "Category",
  page: "Page",
};

export function WebsiteSearch({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<{
    query: string;
    results: SearchResult[];
  }>({ query: "", results: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [retry, setRetry] = useState(0);
  const [selected, setSelected] = useState<DetailsModalItem | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalized = query.trim().slice(0, 100);
  const currentResults =
    response.query === normalized ? response.results : [];
  const pending = Boolean(
    normalized && (loading || response.query !== normalized) && !error
  );

  useEffect(() => {
    if (!open) return;

    setSelected(null);
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    inputRef.current?.focus({ preventScroll: true });

    const handleKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]'
        ) ?? []
      ).filter((element) => element.getClientRects().length > 0);

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const focused = document.activeElement;
      const outside = !dialogRef.current?.contains(focused);

      if (event.shiftKey && (focused === first || outside)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (focused === last || outside)) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      document.removeEventListener("keydown", handleKey);
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    setError("");
    if (!normalized) {
      setResponse({ query: "", results: [] });
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let active = true;
    setLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        const result = await fetch(
          `/api/search?q=${encodeURIComponent(normalized)}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );
        if (!result.ok) throw new Error("Search request failed.");

        const data = (await result.json()) as {
          results?: SearchResult[];
        };
        if (!Array.isArray(data.results)) {
          throw new Error("Invalid search response.");
        }

        if (active) {
          setResponse({ query: normalized, results: data.results });
        }
      } catch {
        if (active && !controller.signal.aborted) {
          setError("Search is temporarily unavailable. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, normalized, retry]);

  function chooseResult(result: SearchResult) {
    onClose();
    if (result.details) setSelected(result.details);
  }

  const panel =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            data-lenis-prevent
            data-lenis-prevent-wheel
            data-lenis-prevent-touch
            className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-slate-950/45 p-3 backdrop-blur-sm sm:p-6"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) onClose();
            }}
          >
            <section
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="website-search-title"
              className="flex max-h-[calc(100dvh-1.5rem)] w-full min-w-0 max-w-2xl flex-col overflow-hidden rounded-2xl border border-red-100 bg-white font-sans shadow-2xl sm:max-h-[calc(100dvh-3rem)]"
            >
              <div className="h-[3px] shrink-0 bg-gradient-to-r from-red-700 via-red-500 to-red-100" />

              <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-4">
                <h2
                  id="website-search-title"
                  className="text-base font-bold text-slate-900"
                >
                  Search GameX
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-red-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                role="search"
                onSubmit={(event) => event.preventDefault()}
                className="px-5"
              >
                <label htmlFor="website-search-input" className="sr-only">
                  Search products, builds, categories and articles
                </label>
                <div className="relative">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-red-600"
                  />
                  <input
                    ref={inputRef}
                    id="website-search-input"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    maxLength={100}
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="Search products, builds, brands…"
                    className="min-h-13 w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-base text-slate-900 outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </form>

              <div
                role="status"
                aria-live="polite"
                className="flex min-h-10 shrink-0 items-center gap-2 px-5 py-2 text-xs text-slate-500"
              >
                {pending ? (
                  <>
                    <LoaderCircle
                      aria-hidden="true"
                      className="h-3.5 w-3.5 animate-spin"
                    />
                    Searching…
                  </>
                ) : error ? (
                  "Search unavailable"
                ) : normalized ? (
                  `${currentResults.length} matches · Results update as you type`
                ) : (
                  "Products, custom builds, categories, articles and pages"
                )}
              </div>

              <div
                className="min-h-0 overflow-y-auto overscroll-contain border-t border-slate-100"
                aria-busy={pending}
              >
                {!normalized && (
                  <p className="px-5 py-8 text-center text-sm text-slate-500">
                    Start typing a product name, brand or component.
                  </p>
                )}

                {error && (
                  <div className="px-5 py-6 text-center">
                    <p className="text-sm text-slate-600">{error}</p>
                    <button
                      type="button"
                      onClick={() => setRetry((value) => value + 1)}
                      className="mt-3 min-h-11 rounded-lg bg-red-50 px-4 text-sm font-semibold text-red-700"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {normalized &&
                  !pending &&
                  !error &&
                  currentResults.length === 0 && (
                    <p className="break-words px-5 py-8 text-center text-sm text-slate-500">
                      No matches for “{normalized}”. Try another name or brand.
                    </p>
                  )}

                {!pending && !error && currentResults.length > 0 && (
                  <ul className="divide-y divide-slate-100">
                    {currentResults.map((result) => {
                      const content = (
                        <>
                          {result.image ? (
                            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg border border-slate-100 bg-white p-1">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={result.image}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-contain"
                              />
                            </div>
                          ) : (
                            <div
                              aria-hidden="true"
                              className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-red-50 text-red-600"
                            >
                              <Search className="h-5 w-5" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-red-600">
                              {labels[result.type]}
                            </p>
                            <p className="mt-0.5 break-words text-sm font-semibold leading-5 text-slate-900">
                              {result.title}
                            </p>
                            {result.details && (
                              <p className="mt-1 text-xs font-bold text-red-600">
                                {formatPrice(result.details.price)}
                              </p>
                            )}
                          </div>

                          <ArrowUpRight
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0 text-slate-400"
                          />
                        </>
                      );

                      const rowClass =
                        "flex min-h-20 w-full min-w-0 items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-red-50/60 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-red-600";

                      return (
                        <li key={result.id}>
                          {result.details ? (
                            <button
                              type="button"
                              onClick={() => chooseResult(result)}
                              className={rowClass}
                            >
                              {content}
                            </button>
                          ) : result.href ? (
                            <Link
                              href={result.href}
                              onClick={onClose}
                              className={rowClass}
                            >
                              {content}
                            </Link>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {normalized &&
                !pending &&
                !error &&
                currentResults.length > 0 && (
                  <div className="shrink-0 border-t border-slate-100 px-5 py-3">
                    <Link
                      href={`/search?q=${encodeURIComponent(normalized)}`}
                      onClick={onClose}
                      className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-red-600"
                    >
                      View more results
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
            </section>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {panel}
      <DetailsModal item={selected} onClose={() => setSelected(null)} />
    </>
  );
}