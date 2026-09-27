import {
  FaWhatsapp,
} from "react-icons/fa6";

import {
  createWhatsAppUrl,
} from "@/lib/whatsapp";

/* =========================================================
   WHATSAPP FLOAT
   ========================================================= */

export function WhatsAppFloat() {
  /* =======================================================
     DEFAULT MESSAGE
     ======================================================= */

  const message =
    "Hi Gamex! I would like to know more about your gaming products and custom PC builds.";

  const whatsappUrl =
    createWhatsAppUrl(
      message
    );

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <a
      href={
        whatsappUrl
      }
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Gamex on WhatsApp"
      title="Chat with us on WhatsApp"
      className="
        group

        fixed

        bottom-5
        right-5

        z-[80]

        flex

        h-14
        w-14

        items-center
        justify-center

        rounded-full

        border-[3px]
        border-white

        bg-[#25D366]

        text-white

        shadow-[0_16px_38px_-12px_rgba(0,0,0,0.32)]

        transition-all

        duration-300

        hover:-translate-y-1

        hover:scale-105

        hover:bg-[#20bd5a]

        hover:shadow-[0_20px_42px_-12px_rgba(37,211,102,0.5)]

        focus:outline-none

        focus:ring-4
        focus:ring-[#25D366]/25

        sm:bottom-6
        sm:right-6
        sm:h-16
        sm:w-16
      "
    >
      {/* =====================================================
          OUTER GAME X RED RING
          ===================================================== */}

      <span
        aria-hidden="true"
        className="
          pointer-events-none

          absolute

          -inset-[6px]

          -z-20

          rounded-full

          border
          border-brand/20

          bg-white/80

          shadow-[0_10px_32px_-18px_rgba(230,0,0,0.45)]

          backdrop-blur-sm

          transition-all

          duration-300

          group-hover:border-brand/40
        "
      />

      {/* =====================================================
          WHATSAPP PULSE
          ===================================================== */}

      <span
        aria-hidden="true"
        className="
          absolute

          inset-0

          -z-10

          rounded-full

          bg-[#25D366]/30

          animate-ping
        "
      />

      {/* =====================================================
          GAME X RED STATUS DOT
          ===================================================== */}

      <span
        aria-hidden="true"
        className="
          absolute

          right-0
          top-0

          z-20

          h-3.5
          w-3.5

          rounded-full

          border-2
          border-white

          bg-brand

          shadow-[0_0_10px_rgba(230,0,0,0.5)]

          sm:h-4
          sm:w-4
        "
      />

      {/* =====================================================
          WHATSAPP ICON
          ===================================================== */}

      <FaWhatsapp
        className="
          relative
          z-10

          h-7
          w-7

          transition-transform

          duration-300

          group-hover:scale-110

          sm:h-8
          sm:w-8
        "
      />

      {/* =====================================================
          TOOLTIP — DESKTOP
          ===================================================== */}

      <span
        className="
          pointer-events-none

          absolute

          right-[calc(100%+16px)]

          hidden

          translate-x-2

          whitespace-nowrap

          opacity-0

          transition-all

          duration-300

          group-hover:translate-x-0

          group-hover:opacity-100

          sm:block
        "
      >
        <span
          className="
            relative

            flex

            items-center

            gap-2

            overflow-hidden

            rounded-xl

            border
            border-black/[0.08]

            bg-white

            px-4
            py-2.5

            text-xs

            font-bold

            text-brand-deep

            shadow-[0_14px_36px_-20px_rgba(0,0,0,0.4)]
          "
        >
          {/* =================================================
              RED LEFT ACCENT
              ================================================= */}

          <span
            aria-hidden="true"
            className="
              absolute

              bottom-0
              left-0
              top-0

              w-[3px]

              bg-brand
            "
          />

          {/* =================================================
              ONLINE DOT
              ================================================= */}

          <span
            aria-hidden="true"
            className="
              relative

              h-2
              w-2

              shrink-0

              rounded-full

              bg-[#25D366]

              shadow-[0_0_8px_rgba(37,211,102,0.5)]
            "
          />

          <span className="relative">
            Chat with us
          </span>
        </span>

        {/* ===================================================
            TOOLTIP ARROW
            =================================================== */}

        <span
          aria-hidden="true"
          className="
            absolute

            -right-1.5
            top-1/2

            h-3
            w-3

            -translate-y-1/2
            rotate-45

            border-r
            border-t
            border-black/[0.06]

            bg-white
          "
        />
      </span>
    </a>
  );
}