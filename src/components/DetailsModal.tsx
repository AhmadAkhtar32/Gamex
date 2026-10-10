"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Check, ArrowUpRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { PhotoGallery } from "@/components/PhotoGallery";
import { formatPrice } from "@/lib/price";
import { createWhatsAppUrl } from "@/lib/whatsapp";

export type DetailsModalItem = {
  kind: "product" | "build";
  name: string;
  price: number | null;
  eyebrow: string;
  badge?: string;
  secondaryLabel?: string;
  description: string;
  specs: string[];
  image: string;
  images?: string[];
};

export function DetailsModal({
  item,
  onClose,
}: {
  item: DetailsModalItem | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!item) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    overlayRef.current?.scrollTo({ top: 0 });
    closeRef.current?.focus({ preventScroll: true });

    const handleKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      // The photo viewer handles its own keyboard events.
      const activeDialog = document.activeElement?.closest(
        '[role="dialog"]'
      );
      if (activeDialog && activeDialog !== dialogRef.current) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], [tabindex="0"]'
        ) ?? []
      ).filter((element) => element.getClientRects().length > 0);

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const focused = document.activeElement;
      const focusOutside = !dialogRef.current?.contains(focused);

      if (event.shiftKey && (focused === first || focusOutside)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (focused === last || focusOutside)) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      window.removeEventListener("keydown", handleKey);

      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [item, onClose]);

  if (!item || typeof document === "undefined") {
    return null;
  }

  const photos = Array.from(
    new Set(
      [item.image, ...(item.images ?? [])]
        .filter((image) => typeof image === "string")
        .map((image) => image.trim())
        .filter(Boolean)
    )
  );

  const message = [
    `Hi GameX, I would like to inquire about this ${
      item.kind === "product" ? "product" : "custom build"
    }:`,
    item.name,
    `Price: ${formatPrice(item.price)}`,
    item.description,
  ]
    .filter(Boolean)
    .join("\n");

  return createPortal(
    <div
      ref={overlayRef}
      data-lenis-prevent
      data-lenis-prevent-wheel
      data-lenis-prevent-touch
      className="fixed inset-0 z-[100] flex h-dvh overflow-x-hidden overflow-y-auto overscroll-contain bg-black/60 p-3 backdrop-blur-sm sm:p-6"
      style={{ WebkitOverflowScrolling: "touch" }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-modal-title"
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        className="relative m-auto flex w-full min-w-0 max-w-6xl shrink-0 flex-col overflow-hidden rounded-2xl border border-red-100/80 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.28)] lg:flex-row"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[3px] bg-gradient-to-r from-red-700 via-red-500 to-red-100"
        />

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="absolute right-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/95 p-2 text-slate-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          <X size={20} />
        </button>

        <div className="relative h-auto min-w-0 w-full shrink-0 border-b border-slate-100 bg-white lg:h-[420px] lg:w-1/2 lg:self-start lg:border-b-0 lg:border-r">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-4 z-10 rounded-xl border border-slate-100/80"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-4 z-10 h-6 w-6 rounded-tl-xl border-l-2 border-t-2 border-red-500/60"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 right-4 z-10 h-6 w-6 rounded-br-xl border-b-2 border-r-2 border-red-500/60"
          />
          <PhotoGallery
            key={`${item.kind}:${item.name}:${item.image}`}
            images={photos}
            title={item.name}
          />
        </div>

        <div className="min-w-0 w-full space-y-4 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.055),transparent_60%)] p-5 pb-6 font-sans sm:p-7 lg:w-1/2 lg:p-8">
          <p className="inline-flex max-w-full items-center gap-2 break-words rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-600"
            />
            {item.eyebrow}
          </p>

          <h2
            id="details-modal-title"
            className="break-words pr-6 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl"
          >
            {item.name}
          </h2>

          {item.badge && (
            <span className="inline-block max-w-full break-words rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {item.badge}
            </span>
          )}

          {item.secondaryLabel && (
            <p className="break-words text-sm leading-6 text-slate-500">
              {item.secondaryLabel}
            </p>
          )}

          <p className="inline-flex max-w-full items-center rounded-lg border border-red-700/10 bg-gradient-to-br from-red-500 to-red-700 px-4 py-2 text-xl font-bold leading-7 text-white shadow-[0_5px_14px_rgba(220,38,38,0.16)] tabular-nums">
            <span className="min-w-0 break-words">
              {formatPrice(item.price)}
            </span>
          </p>

          <p className="whitespace-pre-line break-words text-sm leading-6 text-slate-600">
            {item.description}
          </p>

          {item.specs.length > 0 && (
            <div className="border-t border-slate-100 pt-4">
              <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                <span
                  aria-hidden="true"
                  className="h-3 w-[3px] rounded-full bg-red-600"
                />
                Specifications
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-gradient-to-r from-red-100 to-transparent"
                />
              </p>
              <ul className="space-y-2">
                {item.specs.map((spec, index) => (
                  <li
                    key={`${spec}-${index}`}
                    className={`flex min-w-0 items-start gap-2.5 rounded-md border-l-2 px-2.5 text-sm leading-6 text-slate-700 ${
                      index % 2 === 0
                        ? "border-red-100 bg-red-50/50"
                        : "border-slate-100 bg-slate-50/60"
                    }`}
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                      <Check
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                      />
                    </span>
                    <span className="min-w-0 break-words">
                      {spec}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a
            href={createWhatsAppUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full min-w-0 items-center justify-center gap-3 whitespace-normal rounded-xl border border-[#1fb85a] bg-[#25D366] px-5 py-3.5 text-center font-sans text-sm font-semibold leading-6 tracking-normal text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_6px_18px_rgba(37,211,102,0.18)] transition-colors hover:bg-[#1ebe5d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#128C7E]"
          >
            <FaWhatsapp
              aria-hidden="true"
              className="h-5 w-5 shrink-0"
            />
            <span className="min-w-0 break-words">
              Order on WhatsApp
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 shrink-0 opacity-80"
            />
          </a>
        </div>
      </section>
    </div>,
    document.body
  );
}