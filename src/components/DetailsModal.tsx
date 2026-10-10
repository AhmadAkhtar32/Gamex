"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Check } from "lucide-react";
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
        overflow-hidden bg-black/75 p-2 sm:p-5
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
          rounded-2xl bg-white shadow-2xl
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
            rounded-full bg-white/95 p-2
            text-slate-900 shadow-md
            focus-visible:outline-2 focus-visible:outline-red-600
          "
        >
          <X size={20} />
        </button>

        <div
          className="
            relative h-auto min-w-0
            w-full shrink-0 bg-slate-50
            lg:h-full lg:w-1/2 lg:self-stretch
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
            space-y-4 p-5 pb-8 sm:p-7
            lg:w-1/2 lg:shrink lg:overflow-y-auto
            lg:overscroll-contain
          "
        >
          <p className="text-xs font-bold uppercase tracking-widest text-red-600">
            {item.eyebrow}
          </p>

          <h2
            id="details-modal-title"
            className="break-words pr-6 text-2xl font-extrabold text-slate-900"
          >
            {item.name}
          </h2>

          {item.badge && (
            <span className="inline-block max-w-full break-words rounded bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
              {item.badge}
            </span>
          )}

          {item.secondaryLabel && (
            <p className="break-words text-sm text-slate-500">
              {item.secondaryLabel}
            </p>
          )}

          <p className="inline-flex max-w-full items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-extrabold leading-snug text-white">
            {formatPrice(item.price)}
          </p>

          <p className="whitespace-pre-line break-words leading-relaxed text-slate-600">
            {item.description}
          </p>

          {item.specs.length > 0 && (
            <ul className="space-y-2 border-t border-slate-100 pt-4">
              {item.specs.map((spec, index) => (
                <li
                  key={`${spec}-${index}`}
                  className="flex min-w-0 gap-2 text-sm text-slate-700"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                  <span className="min-w-0 break-words">{spec}</span>
                </li>
              ))}
            </ul>
          )}

          <a
            href={createWhatsAppUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex min-h-12 w-full items-center justify-center gap-2
              whitespace-normal rounded-lg bg-green-600
              px-5 py-3 text-center font-bold text-white
              hover:bg-green-700 sm:w-auto
            "
          >
            <FaWhatsapp className="shrink-0" />
            Order on WhatsApp
          </a>
        </div>
      </section>
    </div>,
    document.body
  );
}