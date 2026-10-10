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

  useEffect(() => {
    if (!item) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousBodyOverflow =
      document.body.style.overflow;

    const previousRootOverflow =
      document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    dialogRef.current?.scrollTo({ top: 0 });
    closeRef.current?.focus({ preventScroll: true });

    const handleKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      // The photo viewer handles its own keyboard events.
      const activeDialog = document.activeElement?.closest(
        '[role="dialog"]'
      );

      if (
        activeDialog &&
        activeDialog !== dialogRef.current
      ) {
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
      document.body.style.overflow =
        previousBodyOverflow;

      document.documentElement.style.overflow =
        previousRootOverflow;

      window.removeEventListener(
        "keydown",
        handleKey
      );

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
      item.kind === "product"
        ? "product"
        : "custom build"
    }:`,
    item.name,
    `Price: ${formatPrice(item.price)}`,
    item.description,
  ]
    .filter(Boolean)
    .join("\n");

  return createPortal(
    <div
      className="
        fixed inset-0 z-[100]
        flex h-dvh items-center justify-center
        overflow-hidden bg-black/65 p-2 backdrop-blur-sm sm:p-5
      "
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
        className="
          relative flex w-full min-w-0 max-w-5xl flex-col
          max-h-[calc(100dvh-1rem)]
          overflow-x-hidden overflow-y-auto overscroll-contain
          rounded-2xl border border-slate-200 bg-white
          shadow-[0_24px_80px_rgba(15,23,42,0.25)]
          sm:max-h-[calc(100dvh-2.5rem)]
          lg:h-[min(760px,92dvh)] lg:max-h-[92dvh]
          lg:flex-row lg:overflow-hidden
        "
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="
            absolute right-3 top-3 z-20
            inline-flex h-11 w-11 items-center justify-center
            rounded-full border border-slate-200 bg-white/95
            p-2 text-slate-700 shadow-sm backdrop-blur-sm
            transition-colors hover:bg-red-50 hover:text-red-600
            focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-red-600
          "
        >
          <X size={20} />
        </button>

        <div
          className="
            relative h-auto min-w-0
            w-full shrink-0 border-b border-slate-100 bg-white
            lg:h-full lg:w-1/2 lg:self-stretch
            lg:border-b-0 lg:border-r
          "
        >
          <PhotoGallery
            key={`${item.kind}:${item.name}:${item.image}`}
            images={photos}
            title={item.name}
          />
        </div>

        <div
          className="
            min-h-0 min-w-0 w-full shrink-0
            space-y-5 bg-gradient-to-b from-white to-slate-50
            p-5 pb-8 font-sans sm:p-7
            lg:w-1/2 lg:shrink lg:overflow-y-auto
            lg:overscroll-contain
          "
        >
          <p
            className="
              inline-flex max-w-full items-center gap-2
              break-words rounded-full border border-red-100
              bg-red-50 px-3 py-1.5
              text-[11px] font-semibold uppercase
              tracking-[0.12em] text-red-600
            "
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-600"
            />
            {item.eyebrow}
          </p>

          <h2
            id="details-modal-title"
            className="
              break-words pr-6 text-2xl font-bold
              leading-tight tracking-tight text-slate-900 sm:text-3xl
            "
          >
            {item.name}
          </h2>

          {item.badge && (
            <span
              className="
                inline-block max-w-full break-words
                rounded-md border border-slate-200 bg-white
                px-3 py-1.5 text-xs font-semibold text-slate-600
              "
            >
              {item.badge}
            </span>
          )}

          {item.secondaryLabel && (
            <p className="break-words text-sm leading-6 text-slate-500">
              {item.secondaryLabel}
            </p>
          )}

          <div
            className="
              flex min-w-0 flex-wrap items-center justify-between gap-3
              rounded-xl border border-red-100 bg-red-50/70 px-4 py-3
            "
          >
            <p className="text-xs font-semibold text-slate-600">
              {item.kind === "build" ? "Starting Price" : "Price"}
            </p>

            <p
              className="
                max-w-full break-words rounded-lg bg-red-600
                px-3 py-2 text-lg font-bold leading-6
                text-white tabular-nums
              "
            >
              {formatPrice(item.price)}
            </p>
          </div>

          <p className="whitespace-pre-line break-words text-sm leading-7 text-slate-600">
            {item.description}
          </p>

          {item.specs.length > 0 && (
            <div className="border-t border-slate-200/80 pt-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Specifications
              </p>

              <ul className="space-y-2">
                {item.specs.map((spec, index) => (
                  <li
                    key={`${spec}-${index}`}
                    className="
                      flex min-w-0 items-start gap-3
                      rounded-lg border border-slate-100 bg-white
                      px-3 py-2.5 text-sm leading-6 text-slate-700
                    "
                  >
                    <span
                      className="
                        mt-0.5 inline-flex h-5 w-5 shrink-0
                        items-center justify-center rounded-full
                        bg-red-50 text-red-600
                      "
                    >
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
            className="
              inline-flex min-h-12 w-full min-w-0
              items-center justify-center gap-3
              whitespace-normal rounded-xl border border-emerald-700/15
              bg-emerald-600 px-5 py-3.5 text-center
              font-sans text-sm font-semibold leading-6
              tracking-[0.015em] text-white
              shadow-[0_4px_12px_rgba(5,150,105,0.15)]
              transition-colors hover:bg-emerald-700
              focus-visible:outline-2 focus-visible:outline-offset-4
              focus-visible:outline-emerald-600
            "
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