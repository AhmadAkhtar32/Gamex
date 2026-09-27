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

/* =========================================================
   TYPES
   ========================================================= */

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

/* =========================================================
   WHATSAPP MESSAGE
   ========================================================= */

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

/* =========================================================
   DETAILS MODAL
   ========================================================= */

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

  /* =======================================================
     LOCK BACKGROUND SCROLL
     ======================================================= */

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

    /* =====================================================
       ESC KEY
       ===================================================== */

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

    /* =====================================================
       AUTO FOCUS CLOSE BUTTON
       ===================================================== */

    const focusTimer =
      window.setTimeout(
        () => {
          closeButtonRef
            .current
            ?.focus();
        },
        50
      );

    /* =====================================================
       CLEANUP
       ===================================================== */

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

  /* =======================================================
     WHATSAPP BUTTON
     ======================================================= */

  const handleWhatsAppClick =
    () => {
      if (!item) {
        return;
      }

      let imageUrl =
        item.image;

      /*
       * Convert relative image path into
       * full URL for WhatsApp.
       */
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

  /* =======================================================
     CLIENT ONLY
     ======================================================= */

  if (
    typeof document ===
    "undefined"
  ) {
    return null;
  }

  /* =======================================================
     PORTAL
     ======================================================= */

  return createPortal(
    <AnimatePresence>
      {item ? (
        <motion.div
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className="
            fixed
            inset-0
            z-[200]

            flex

            items-center
            justify-center

            overflow-hidden

            p-3

            sm:p-5
            md:p-6
          "
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
          {/* =================================================
              BACKDROP
              ================================================= */}

          <motion.button
            type="button"
            aria-label="Close details"
            onClick={
              onClose
            }
            className="
              absolute
              inset-0

              cursor-default

              bg-black/75

              backdrop-blur-md
            "
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

          {/* =================================================
              RED BACKDROP GLOW
              ================================================= */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none

              absolute

              left-1/2
              top-1/2

              h-[34rem]
              w-[34rem]

              -translate-x-1/2
              -translate-y-1/2

              rounded-full

              bg-brand/15

              blur-[150px]
            "
          />

          {/* =================================================
              MODAL
              ================================================= */}

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
            className="
              relative
              z-10

              flex

              max-h-[92vh]

              w-full
              max-w-5xl

              flex-col

              overflow-hidden

              overscroll-contain

              rounded-[1.75rem]

              border
              border-white/80

              bg-white

              shadow-[0_40px_110px_-35px_rgba(0,0,0,0.75)]

              lg:flex-row
            "
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
            {/* =================================================
                RED TOP LINE
                ================================================= */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none

                absolute

                inset-x-0
                top-0

                z-30

                h-[3px]

                bg-gradient-to-r

                from-transparent
                via-brand
                to-transparent
              "
            />

            {/* =================================================
                CLOSE BUTTON
                ================================================= */}

            <button
              ref={
                closeButtonRef
              }
              type="button"
              onClick={
                onClose
              }
              aria-label="Close details"
              className="
                absolute

                right-3
                top-3

                z-40

                grid

                h-10
                w-10

                place-items-center

                rounded-full

                border
                border-black/10

                bg-white/95

                text-black

                shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)]

                backdrop-blur

                transition-all

                duration-300

                hover:scale-105

                hover:border-brand

                hover:bg-brand

                hover:text-white

                focus:outline-none

                focus:ring-4
                focus:ring-brand/15

                sm:right-4
                sm:top-4
              "
            >
              <X className="h-5 w-5" />
            </button>

            {/* =================================================
                IMAGE SIDE
                ================================================= */}

            <div
              className="
                relative

                min-h-[250px]

                shrink-0

                overflow-hidden

                border-b
                border-black/[0.06]

                bg-[#fff7f7]

                sm:min-h-[300px]

                lg:min-h-0
                lg:w-[46%]

                lg:border-b-0
                lg:border-r
              "
            >
              {/* =================================================
                  IMAGE
                  FULL IMAGE - NO CROPPING
                  ================================================= */}

              {/* eslint-disable-next-line @next/next/no-img-element */}

              <img
                src={
                  item.image
                }
                alt={
                  item.name
                }
                className="
                  h-full
                  w-full

                  object-contain

                  p-5

                  sm:p-8
                  lg:p-10
                "
              />

              {/* =================================================
                  IMAGE GRADIENT
                  ================================================= */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none

                  absolute
                  inset-0

                  bg-gradient-to-t

                  from-brand/[0.07]
                  via-transparent
                  to-transparent
                "
              />

              {/* =================================================
                  SUBTLE GRID
                  ================================================= */}

              <div
                aria-hidden="true"
                className="
                  bg-grid

                  pointer-events-none

                  absolute
                  inset-0

                  opacity-20

                  [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]
                "
              />

              {/* =================================================
                  IMAGE CORNER DECORATION
                  ================================================= */}

              <div
                aria-hidden="true"
                className="
                  absolute

                  bottom-5
                  left-5

                  h-10
                  w-10

                  border-b-2
                  border-l-2

                  border-brand/35
                "
              />

              <div
                aria-hidden="true"
                className="
                  absolute

                  right-5
                  top-5

                  h-10
                  w-10

                  border-r-2
                  border-t-2

                  border-brand/35
                "
              />

              {/* =================================================
                  BADGE
                  ================================================= */}

              {item.badge ? (
                <span
                  className="
                    absolute

                    left-4
                    top-4

                    rounded-full

                    border
                    border-brand/20

                    bg-white/95

                    px-3
                    py-1.5

                    text-[10px]

                    font-extrabold

                    uppercase

                    tracking-wider

                    text-brand

                    shadow-[0_10px_25px_-16px_rgba(230,0,0,0.55)]

                    backdrop-blur-md
                  "
                >
                  {
                    item.badge
                  }
                </span>
              ) : null}
            </div>

            {/* =================================================
                DETAILS SIDE
                ================================================= */}

            <div
              className="
                flex

                min-h-0

                flex-1

                flex-col

                overflow-hidden

                bg-white
              "
            >
              {/* =================================================
                  SCROLLABLE AREA
                  ================================================= */}

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
                className="
                  min-h-0

                  flex-1

                  touch-pan-y

                  overflow-y-auto

                  overscroll-contain

                  px-5
                  pb-6
                  pt-8

                  sm:px-8
                  sm:pb-8
                  sm:pt-10

                  lg:px-9
                  lg:pb-9
                  lg:pt-11
                "
              >
                {/* =================================================
                    CATEGORY
                    ================================================= */}

                <div
                  className="
                    flex

                    items-center

                    gap-2

                    pr-12
                  "
                >
                  <span
                    className="
                      h-2
                      w-2

                      rounded-full

                      bg-brand

                      shadow-[0_0_10px_rgba(230,0,0,0.45)]
                    "
                  />

                  <p
                    className="
                      text-[10px]

                      font-extrabold

                      uppercase

                      tracking-[0.24em]

                      text-brand
                    "
                  >
                    {
                      item.eyebrow
                    }
                  </p>
                </div>

                {/* =================================================
                    NAME
                    ================================================= */}

                <h2
                  id="details-modal-title"
                  className="
                    mt-3

                    pr-12

                    font-display

                    text-2xl

                    font-extrabold

                    leading-tight

                    text-brand-deep

                    sm:text-3xl
                    lg:text-[2rem]
                  "
                >
                  {
                    item.name
                  }
                </h2>

                {/* =================================================
                    BUILD ROLE
                    ================================================= */}

                {item.secondaryLabel ? (
                  <p
                    className="
                      mt-2

                      text-xs

                      font-bold

                      uppercase

                      tracking-[0.15em]

                      text-slate-500
                    "
                  >
                    {
                      item.secondaryLabel
                    }
                  </p>
                ) : null}

                {/* =================================================
                    PRICE BLOCK
                    ================================================= */}

                <div
                  className="
                    relative

                    mt-5

                    inline-flex

                    min-w-[210px]

                    flex-col

                    overflow-hidden

                    rounded-xl

                    bg-brand

                    px-5
                    py-4

                    shadow-[0_18px_40px_-20px_rgba(230,0,0,0.7)]
                  "
                >
                  {/* ===============================================
                      PRICE DECORATION
                      =============================================== */}

                  <div
                    aria-hidden="true"
                    className="
                      absolute

                      -right-8
                      -top-8

                      h-24
                      w-24

                      rotate-45

                      border

                      border-white/15
                    "
                  />

                  <div
                    aria-hidden="true"
                    className="
                      absolute

                      right-4
                      top-1/2

                      h-10
                      w-1

                      -translate-y-1/2

                      rounded-full

                      bg-white/15
                    "
                  />

                  <span
                    className="
                      relative

                      text-[9px]

                      font-extrabold

                      uppercase

                      tracking-[0.22em]

                      text-white/65
                    "
                  >
                    {item.kind ===
                    "build"
                      ? "Starting Price"
                      : "Price"}
                  </span>

                  <span
                    className="
                      relative

                      mt-1

                      font-display

                      text-2xl

                      font-extrabold

                      leading-none

                      text-white

                      sm:text-[1.7rem]
                    "
                  >
                    {formatPrice(
                      item.price
                    )}
                  </span>
                </div>

                {/* =================================================
                    DESCRIPTION
                    FULL DESCRIPTION
                    ================================================= */}

                <div className="mt-7">
                  <h3
                    className="
                      font-display

                      text-xs

                      font-extrabold

                      uppercase

                      tracking-[0.14em]

                      text-brand-deep
                    "
                  >
                    Description
                  </h3>

                  <div
                    className="
                      mt-3

                      h-[2px]
                      w-10

                      rounded-full

                      bg-brand
                    "
                  />

                  <p
                    className="
                      mt-4

                      whitespace-pre-line

                      text-sm

                      leading-7

                      text-slate-600

                      sm:text-[15px]
                    "
                  >
                    {
                      item.description
                    }
                  </p>
                </div>

                {/* =================================================
                    SPECIFICATIONS
                    FULL SPECS
                    ================================================= */}

                {item.specs.length >
                0 ? (
                  <div className="mt-8">
                    <div
                      className="
                        flex

                        items-center

                        justify-between

                        gap-4
                      "
                    >
                      <div>
                        <h3
                          className="
                            font-display

                            text-xs

                            font-extrabold

                            uppercase

                            tracking-[0.14em]

                            text-brand-deep
                          "
                        >
                          Specifications
                        </h3>

                        <div
                          className="
                            mt-3

                            h-[2px]
                            w-10

                            rounded-full

                            bg-brand
                          "
                        />
                      </div>

                      <span
                        className="
                          rounded-full

                          bg-brand/[0.06]

                          px-3
                          py-1.5

                          text-[9px]

                          font-extrabold

                          uppercase

                          tracking-wider

                          text-brand
                        "
                      >
                        {
                          item.specs.length
                        }{" "}
                        Specs
                      </span>
                    </div>

                    <ul
                      className="
                        mt-5

                        grid

                        gap-3

                        sm:grid-cols-2
                      "
                    >
                      {item.specs.map(
                        (
                          spec,
                          index
                        ) => (
                          <li
                            key={`${item.name}-${index}`}
                            className="
                              group/spec

                              flex

                              items-start

                              gap-3

                              rounded-xl

                              border

                              border-black/[0.07]

                              bg-[#fff8f8]

                              px-3.5
                              py-3

                              text-sm

                              leading-5

                              text-slate-700

                              transition-all

                              duration-300

                              hover:border-brand/20

                              hover:bg-brand/[0.045]
                            "
                          >
                            <span
                              className="
                                mt-0.5

                                grid

                                h-5
                                w-5

                                shrink-0

                                place-items-center

                                rounded-full

                                bg-brand/[0.09]

                                text-brand

                                transition-all

                                group-hover/spec:bg-brand

                                group-hover/spec:text-white
                              "
                            >
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

                {/* =================================================
                    GAMEX ASSURANCE
                    ================================================= */}

                <div
                  className="
                    mt-8

                    rounded-xl

                    border

                    border-brand/10

                    bg-brand/[0.035]

                    p-4
                  "
                >
                  <div
                    className="
                      flex

                      items-start

                      gap-3
                    "
                  >
                    <span
                      className="
                        mt-1

                        h-2
                        w-2

                        shrink-0

                        rounded-full

                        bg-brand

                        shadow-[0_0_10px_rgba(230,0,0,0.4)]
                      "
                    />

                    <div>
                      <p
                        className="
                          text-[10px]

                          font-extrabold

                          uppercase

                          tracking-[0.16em]

                          text-brand
                        "
                      >
                        Gamex Support
                      </p>

                      <p
                        className="
                          mt-1

                          text-xs

                          leading-relaxed

                          text-slate-500
                        "
                      >
                        Contact us on WhatsApp for availability,
                        configuration options and ordering details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  WHATSAPP FOOTER
                  ================================================= */}

              <div
                className="
                  shrink-0

                  border-t

                  border-black/[0.07]

                  bg-white

                  px-5
                  py-4

                  shadow-[0_-12px_35px_-30px_rgba(0,0,0,0.25)]

                  sm:px-8
                  sm:py-5

                  lg:px-9
                "
              >
                <button
                  type="button"
                  onClick={
                    handleWhatsAppClick
                  }
                  className="
                    group

                    relative

                    flex

                    w-full

                    items-center

                    justify-center

                    gap-2.5

                    overflow-hidden

                    rounded-xl

                    bg-[#25D366]

                    px-5
                    py-3.5

                    text-sm

                    font-extrabold

                    uppercase

                    tracking-wider

                    text-white

                    shadow-[0_14px_35px_-16px_rgba(37,211,102,0.7)]

                    transition-all

                    duration-300

                    hover:-translate-y-0.5

                    hover:bg-[#20bd5a]

                    hover:shadow-[0_18px_40px_-16px_rgba(37,211,102,0.85)]

                    focus:outline-none

                    focus:ring-4

                    focus:ring-[#25D366]/25
                  "
                >
                  {/* ===============================================
                      BUTTON SHINE
                      =============================================== */}

                  <span
                    aria-hidden="true"
                    className="
                      absolute

                      -left-12
                      top-0

                      h-full
                      w-10

                      -skew-x-12

                      bg-white/20

                      transition-all

                      duration-700

                      group-hover:left-[120%]
                    "
                  />

                  <FaWhatsapp
                    className="
                      relative

                      h-5
                      w-5

                      transition-transform

                      duration-300

                      group-hover:scale-110
                    "
                  />

                  <span className="relative">
                    Chat on WhatsApp
                  </span>
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