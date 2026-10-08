
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

  useEffect(() => {
    if (!item) return;

    const previousBodyOverflow =
      document.body.style.overflow;

    const previousRootOverflow =
      document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    closeRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
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
    };
  }, [item, onClose]);

  if (!item || typeof document === "undefined") {
    return null;
  }

  const photos = Array.from(
    new Set(
      [item.image, ...(item.images ?? [])].filter(Boolean)
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
        flex items-center justify-center
        bg-black/75 p-2 sm:p-5
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-modal-title"
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        className="
          relative flex w-full max-w-5xl flex-col
          overflow-y-auto overscroll-contain
          rounded-2xl bg-white shadow-2xl
          lg:max-h-[92dvh] lg:flex-row
          lg:overflow-hidden
        "
        style={{
          maxHeight: "calc(100dvh - 1rem)",
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
            rounded-full bg-white/95 p-2
            text-slate-900 shadow-md
          "
        >
          <X size={20} />
        </button>

        <div
          className="
            relative h-[min(72vw,360px)]
            w-full shrink-0 bg-slate-50
            sm:h-[390px]
            lg:h-auto lg:w-1/2 lg:self-stretch
          "
        >
          <PhotoGallery
            images={photos}
            title={item.name}
          />
        </div>

        <div
          className="
            min-h-0 w-full shrink-0
            space-y-4 p-5 pb-8 sm:p-7
            lg:w-1/2 lg:shrink lg:overflow-y-auto
          "
        >
          <p className="text-xs font-bold uppercase tracking-widest text-red-600">
            {item.eyebrow}
          </p>

          <h2
            id="details-modal-title"
            className="pr-6 text-2xl font-extrabold text-slate-900"
          >
            {item.name}
          </h2>

          {item.badge && (
            <span className="inline-block rounded bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
              {item.badge}
            </span>
          )}

          {item.secondaryLabel && (
            <p className="text-sm text-slate-500">
              {item.secondaryLabel}
            </p>
          )}

          <p className="inline-flex rounded-lg bg-red-600 px-4 py-2 text-base font-extrabold text-white">
            {formatPrice(item.price)}
          </p>

          <p className="whitespace-pre-line leading-relaxed text-slate-600">
            {item.description}
          </p>

          {item.specs.length > 0 && (
            <ul className="space-y-2 border-t border-slate-100 pt-4">
              {item.specs.map((spec, index) => (
                <li
                  key={`${spec}-${index}`}
                  className="flex gap-2 text-sm text-slate-700"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                  {spec}
                </li>
              ))}
            </ul>
          )}

          <a
            href={createWhatsAppUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2
              rounded-lg bg-green-600
              px-5 py-3 font-bold text-white
              hover:bg-green-700
            "
          >
            <FaWhatsapp />
            Inquire on WhatsApp
          </a>
        </div>
      </section>
    </div>,
    document.body
  );
}
