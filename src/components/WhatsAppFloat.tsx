import { FaWhatsapp } from "react-icons/fa6";

import { createWhatsAppUrl } from "@/lib/whatsapp";

/* =========================================================
   WHATSAPP FLOAT
   ========================================================= */

export function WhatsAppFloat() {
  const message =
    "Hi Gamex! I would like to know more about your gaming products and custom PC builds.";

  const whatsappUrl = createWhatsAppUrl(message);

  return (
    <a
      href={whatsappUrl}
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

        bg-[#25D366]
        text-white

        shadow-[0_16px_38px_-12px_rgba(37,211,102,0.48)]

        transition-all
        duration-300

        hover:-translate-y-1
        hover:scale-105
        hover:bg-[#20bd5a]
        hover:shadow-[0_20px_44px_-12px_rgba(37,211,102,0.6)]

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
          SOFT OUTER GLOW
          ===================================================== */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none

          absolute
          -inset-2
          -z-10

          rounded-full

          bg-[#25D366]/18

          blur-md

          transition-all
          duration-300

          group-hover:bg-[#25D366]/24
        "
      />

      {/* =====================================================
          PULSE RING
          ===================================================== */}
      <span
        aria-hidden="true"
        className="
          absolute
          inset-0
          -z-20

          rounded-full

          bg-[#25D366]/30

          animate-ping
        "
      />

      {/* =====================================================
          ICON
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

            rounded-xl

            bg-[#25D366]

            px-4
            py-2.5

            text-xs
            font-bold

            text-white

            shadow-[0_14px_36px_-18px_rgba(37,211,102,0.55)]
          "
        >
          <span
            aria-hidden="true"
            className="
              h-2
              w-2

              rounded-full

              bg-white/90
            "
          />

          <span>Chat with us</span>
        </span>

        {/* Arrow */}
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

            bg-[#25D366]
          "
        />
      </span>
    </a>
  );
}