"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Check,
  X,
} from "lucide-react";

import {
  FaWhatsapp,
} from "react-icons/fa6";

import {
  formatPrice,
} from "@/lib/price";

import {
  createWhatsAppUrl,
} from "@/lib/whatsapp";

export type DetailsModalItem = {
  kind:
    | "product"
    | "build";

  name: string;

  price:
    | number
    | null;

  eyebrow: string;

  badge?: string;

  secondaryLabel?: string;

  description: string;

  specs: string[];

  image: string;
};

function buildWhatsAppMessage(
  item: DetailsModalItem,
  imageUrl: string
) {
  const itemLabel =
    item.kind === "product"
      ? "Product"
      : "Custom Build";

  const lines = [
    "Hi Gamex! I would like to inquire about the following:",
    "",
    `${itemLabel}: ${item.name}`,
    `Price: ${formatPrice(
      item.price
    )}`,
  ];

  if (item.eyebrow) {
    lines.push(
      `${
        item.kind ===
        "product"
          ? "Category"
          : "Type"
      }: ${item.eyebrow}`
    );
  }

  if (item.badge) {
    lines.push(
      `Tag: ${item.badge}`
    );
  }

  if (
    item.secondaryLabel
  ) {
    lines.push(
      `Details: ${item.secondaryLabel}`
    );
  }

  if (
    item.description
  ) {
    lines.push(
      "",
      `Description: ${item.description}`
    );
  }

  if (
    item.specs.length >
    0
  ) {
    lines.push(
      "",
      "Specifications:"
    );

    item.specs.forEach(
      (spec) => {
        lines.push(
          `• ${spec}`
        );
      }
    );
  }

  if (imageUrl) {
    lines.push(
      "",
      item.kind ===
      "product"
        ? "Product Image:"
        : "Build Image:",
      imageUrl
    );
  }

  lines.push(
    "",
    item.kind ===
    "product"
      ? "Please share the current availability and any other details."
      : "Please share the current availability and configuration options for this build."
  );

  return lines.join(
    "\n"
  );
}

export function DetailsModal({
  item,
  onClose,
}: {
  item:
    | DetailsModalItem
    | null;

  onClose: () => void;
}) {
  const closeButtonRef =
    useRef<HTMLButtonElement>(
      null
    );

  useEffect(() => {
    if (!item) {
      return;
    }

    const scrollY =
      window.scrollY;

    const previousBodyOverflow =
      document.body.style
        .overflow;

    const previousBodyPosition =
      document.body.style
        .position;

    const previousBodyTop =
      document.body.style.top;

    const previousBodyWidth =
      document.body.style
        .width;

    const previousHtmlOverflow =
      document
        .documentElement
        .style
        .overflow;

    document.documentElement.style.overflow =
      "hidden";

    document.body.style.overflow =
      "hidden";

    document.body.style.position =
      "fixed";

    document.body.style.top =
      `-${scrollY}px`;

    document.body.style.width =
      "100%";

    const onKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      onKeyDown
    );

    const focusTimer =
      window.setTimeout(
        () => {
          closeButtonRef
            .current
            ?.focus();
        },
        50
      );

    return () => {
      window.clearTimeout(
        focusTimer
      );

      document.removeEventListener(
        "keydown",
        onKeyDown
      );

      document.documentElement.style.overflow =
        previousHtmlOverflow;

      document.body.style.overflow =
        previousBodyOverflow;

      document.body.style.position =
        previousBodyPosition;

      document.body.style.top =
        previousBodyTop;

      document.body.style.width =
        previousBodyWidth;

      window.scrollTo(
        0,
        scrollY
      );
    };
  }, [
    item,
    onClose,
  ]);

  const handleWhatsAppClick =
    () => {
      if (!item) {
        return;
      }

      let imageUrl =
        item.image;

      try {
        imageUrl =
          new URL(
            item.image,
            window.location
              .origin
          ).href;
      } catch {
        imageUrl =
          item.image;
      }

      const message =
        buildWhatsAppMessage(
          item,
          imageUrl
        );

      const whatsappUrl =
        createWhatsAppUrl(
          message
        );

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );
    };

  if (
    typeof document ===
    "undefined"
  ) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {item ? (
        <motion.div
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden p-4 sm:p-6"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.2,
          }}
        >
          <motion.button
            type="button"
            aria-label="Close details"
            className="absolute inset-0 cursor-default bg-brand-deep/70 backdrop-blur-md"
            onClick={
              onClose
            }
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="details-modal-title"
            data-lenis-prevent
            data-lenis-prevent-wheel
            data-lenis-prevent-touch
            onWheel={(
              event
            ) => {
              event.stopPropagation();
            }}
            onTouchMove={(
              event
            ) => {
              event.stopPropagation();
            }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden overscroll-contain rounded-3xl border border-white/70 bg-white shadow-[0_35px_100px_-30px_rgba(13,34,70,0.65)] lg:flex-row"
            initial={{
              opacity: 0,
              y: 28,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 18,
              scale: 0.98,
            }}
            transition={{
              duration: 0.28,

              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            <button
              ref={
                closeButtonRef
              }
              type="button"
              onClick={
                onClose
              }
              aria-label="Close details"
              className="absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-white/95 text-brand-deep shadow-lg backdrop-blur transition hover:scale-105 hover:bg-brand hover:text-white focus:outline-none focus:ring-4 focus:ring-brand/20 sm:right-4 sm:top-4"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative min-h-[240px] shrink-0 overflow-hidden bg-[#f4f7fb] sm:min-h-[280px] lg:min-h-0 lg:w-[46%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  item.image
                }
                alt={
                  item.name
                }
                className={`
                  h-full
                  w-full

                  ${
                    item.kind ===
                    "product"
                      ? "object-contain p-5 sm:p-8"
                      : "object-cover"
                  }
                `}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-deep/20 via-transparent to-transparent" />

              {item.badge ? (
                <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-brand shadow-sm backdrop-blur">
                  {
                    item.badge
                  }
                </span>
              ) : null}
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div
                data-lenis-prevent
                data-lenis-prevent-wheel
                data-lenis-prevent-touch
                onWheel={(
                  event
                ) => {
                  event.stopPropagation();
                }}
                onTouchMove={(
                  event
                ) => {
                  event.stopPropagation();
                }}
                className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain px-5 pb-5 pt-7 sm:px-8 sm:pb-7 sm:pt-9 lg:px-9 lg:pb-8 lg:pt-10"
              >
                <p className="pr-12 text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
                  {
                    item.eyebrow
                  }
                </p>

                <h2
                  id="details-modal-title"
                  className="mt-2 pr-12 font-display text-2xl font-extrabold leading-tight text-brand-deep sm:text-3xl"
                >
                  {
                    item.name
                  }
                </h2>

                <div className="mt-4 inline-flex items-center rounded-xl bg-brand/[0.07] px-4 py-2.5">
                  <span className="font-display text-xl font-extrabold text-brand sm:text-2xl">
                    {formatPrice(
                      item.price
                    )}
                  </span>
                </div>

                {item.secondaryLabel ? (
                  <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-brand-soft">
                    {
                      item.secondaryLabel
                    }
                  </p>
                ) : null}

                <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-[15px]">
                  {
                    item.description
                  }
                </p>

                {item.specs.length >
                0 ? (
                  <div className="mt-7">
                    <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-brand-deep">
                      Specifications
                    </h3>

                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {item.specs.map(
                        (
                          spec,
                          index
                        ) => (
                          <li
                            key={`${item.name}-${index}`}
                            className="flex items-start gap-2.5 rounded-xl border border-brand/[0.08] bg-[#f7f9fc] px-3.5 py-3 text-sm leading-5 text-slate-700"
                          >
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand/[0.09] text-brand">
                              <Check className="h-3.5 w-3.5" />
                            </span>

                            <span>
                              {
                                spec
                              }
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="shrink-0 border-t border-brand/[0.08] bg-white px-5 py-4 sm:px-8 sm:py-5 lg:px-9">
                <button
                  type="button"
                  onClick={
                    handleWhatsAppClick
                  }
                  className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-[0_14px_35px_-16px_rgba(37,211,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#20bd5a] hover:shadow-[0_18px_40px_-16px_rgba(37,211,102,0.85)] focus:outline-none focus:ring-4 focus:ring-[#25D366]/25"
                >
                  <FaWhatsapp className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />

                  Chat on WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}