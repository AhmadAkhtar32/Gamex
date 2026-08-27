import { Gamepad2, ArrowUp } from "lucide-react";
import { navLinks } from "@/lib/data";
import {
  InstagramIcon,
  TwitchIcon,
  XIcon,
  YoutubeIcon,
} from "./social-icons";

export function Footer() {
  return (
    <footer
      className="
        relative
        overflow-hidden
        border-t
        border-brand/10
        bg-[#f7f9fc]
      "
    >
      {/* =====================================================
          BACKGROUND EFFECTS
          ===================================================== */}

      <div
        className="
          bg-grid
          absolute
          inset-0
          opacity-20
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          bottom-0
          h-72
          w-72
          rounded-full
          bg-brand/[0.045]
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          top-0
          h-72
          w-72
          rounded-full
          bg-brand-soft/[0.035]
          blur-[120px]
        "
      />

      {/* =====================================================
          FOOTER CONTENT
          ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-5
          py-14
          md:px-8
        "
      >
        <div
          className="
            grid
            gap-10
            md:grid-cols-3
          "
        >
          {/* =================================================
              BRAND
              ================================================= */}

          <div>
            <a
              href="#home"
              className="
                group
                flex
                items-center
                gap-2.5
              "
            >
              <span
                className="
                  grid
                  h-9
                  w-9
                  place-items-center

                  rounded-lg

                  bg-brand
                  text-white

                  shadow-[0_12px_30px_-14px_rgba(23,49,96,0.65)]

                  transition-all
                  duration-300

                  group-hover:scale-110
                  group-hover:rotate-6
                  group-hover:bg-brand-soft
                "
              >
                <Gamepad2 className="h-5 w-5" />
              </span>

              <span
                className="
                  font-display
                  text-xl
                  font-extrabold
                  tracking-widest
                  text-brand-deep
                "
              >
                GAME
                <span className="text-brand">
                  X
                </span>
              </span>
            </a>

            <p
              className="
                mt-4
                max-w-xs

                text-sm
                leading-relaxed
                text-slate-600
              "
            >
              Premium gaming hardware for players who refuse to lose.
              Custom PCs, GPUs, RAM, processors and pro accessories —
              built to win.
            </p>

            {/* ===============================================
                SOCIAL ICONS
                =============================================== */}

            <div className="mt-5 flex gap-3">
              {[
                XIcon,
                InstagramIcon,
                YoutubeIcon,
                TwitchIcon,
              ].map((Icon, index) => (
                <a
                  key={index}
                  href="#home"
                  aria-label="Social link"
                  className="
                    grid
                    h-9
                    w-9
                    place-items-center

                    rounded-lg

                    border
                    border-brand/12

                    bg-white

                    text-slate-600

                    shadow-sm

                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:border-brand
                    hover:bg-brand
                    hover:text-white
                    hover:shadow-[0_10px_24px_-14px_rgba(23,49,96,0.6)]
                  "
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* =================================================
              NAVIGATION
              ================================================= */}

          <div>
            <h4
              className="
                font-display
                text-sm
                font-bold
                uppercase
                tracking-widest
                text-brand-deep
              "
            >
              Navigate
            </h4>

            <ul
              className="
                mt-4
                grid
                grid-cols-2
                gap-2
              "
            >
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="
                      text-sm
                      font-medium
                      text-slate-500

                      transition-colors
                      duration-300

                      hover:text-brand
                    "
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* =================================================
              CONTACT
              ================================================= */}

          <div>
            <h4
              className="
                font-display
                text-sm
                font-bold
                uppercase
                tracking-widest
                text-brand-deep
              "
            >
              Get in touch
            </h4>

            <ul
              className="
                mt-4
                space-y-2

                text-sm
                text-slate-500
              "
            >
              <li>hello@gamex.gg</li>
              <li>+1 (555) 010-1234</li>
              <li>Neon District, Tech City</li>
            </ul>

            <a
              href="#contact"
              className="
                cta-pulse
                mt-5
                inline-flex
                items-center
                gap-2

                rounded-lg

                bg-brand

                px-5
                py-2.5

                font-display
                text-xs
                font-bold
                uppercase
                tracking-widest
                text-white

                shadow-[0_12px_30px_-14px_rgba(23,49,96,0.65)]

                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:bg-brand-soft
              "
            >
              Start Your Build
            </a>
          </div>
        </div>

        {/* ===================================================
            BOTTOM BAR
            =================================================== */}

        <div
          className="
            mt-12
            flex
            flex-col
            items-center
            justify-between
            gap-4

            border-t
            border-brand/10

            pt-6

            sm:flex-row
          "
        >
          <p
            className="
              text-sm
              text-slate-500
            "
          >
            © {new Date().getFullYear()} Gamex. All rights reserved.
            Play hard.
          </p>

          <a
            href="#home"
            className="
              inline-flex
              items-center
              gap-2

              text-sm
              font-semibold
              uppercase
              tracking-wider
              text-slate-500

              transition-all
              duration-300

              hover:-translate-y-0.5
              hover:text-brand
            "
          >
            Back to top

            <ArrowUp className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}