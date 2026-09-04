import {
  FaWhatsapp,
} from "react-icons/fa6";

export function WhatsAppFloat() {
  /*
   * Replace this with your real WhatsApp number.
   *
   * IMPORTANT:
   * Use international format.
   *
   * Example Pakistan:
   *
   * 0300 1234567
   *
   * becomes:
   *
   * 923001234567
   *
   * Do NOT include:
   * +
   * spaces
   * dashes
   * brackets
   */

  const whatsappNumber =
    "923001234567";

  const message =
    "Hi Gamex! I would like to know more about your gaming products and custom PC builds.";

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

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

        bg-[#25D366]
        text-white

        shadow-[0_10px_35px_rgba(37,211,102,0.35)]

        transition-all
        duration-300

        hover:scale-110
        hover:bg-[#20bd5a]

        focus:outline-none
        focus:ring-4
        focus:ring-[#25D366]/30

        sm:bottom-6
        sm:right-6
        sm:h-16
        sm:w-16
      "
    >
      {/* =====================================================
          PULSE EFFECT
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
          WHATSAPP ICON
          ===================================================== */}

      <FaWhatsapp
        className="
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
          right-[calc(100%+12px)]

          hidden
          whitespace-nowrap

          rounded-lg

          bg-brand-deep

          px-3
          py-2

          text-xs
          font-semibold
          text-white

          opacity-0

          shadow-lg

          transition-all
          duration-300

          group-hover:-translate-x-1
          group-hover:opacity-100

          sm:block
        "
      >
        Chat with us
      </span>
    </a>
  );
}