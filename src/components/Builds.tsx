import { ArrowRight, Check } from "lucide-react";
import { builds } from "@/lib/data";
import { SectionHeading, SpotlightCard } from "./ui";
import { BlurReveal, ScrollSkew } from "./fx";

export function Builds() {
  return (
    <section
      id="builds"
      className="
        relative
        overflow-hidden
        bg-[#f7f9fc]
        py-24
        md:py-32
      "
    >
      {/* =====================================================
          BACKGROUND EFFECTS
          ===================================================== */}

      <div
        className="
          bg-grid
          grid-animated
          absolute
          inset-0
          -z-10
          opacity-35
          [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]
        "
      />

      <div
        className="
          absolute
          -left-40
          top-1/3
          -z-10
          h-[28rem]
          w-[28rem]
          rounded-full
          bg-brand/[0.045]
          blur-[140px]
        "
      />

      <div
        className="
          absolute
          -right-40
          bottom-0
          -z-10
          h-[30rem]
          w-[30rem]
          rounded-full
          bg-brand-soft/[0.04]
          blur-[150px]
        "
      />

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Custom Builds"
          title="Built for your playstyle"
          accent="your"
          subtitle="Three signature rigs, tuned and stress-tested by our engineers. Configure any of them — or design your own from scratch."
        />

        {/* ===================================================
            BUILD GRID
            =================================================== */}

        <ScrollSkew
          amount={2}
          className="
            mt-14
            grid
            gap-6
            lg:grid-cols-3
          "
        >
          {builds.map((build, index) => (
            <BlurReveal
              key={build.name}
              delay={index * 0.1}
              className="h-full"
            >
              <SpotlightCard
                className="
                  group
                  flex
                  h-full
                  flex-col
                  rounded-2xl

                  border
                  border-brand/12

                  bg-white

                  shadow-[0_20px_55px_-36px_rgba(23,49,96,0.4)]

                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:border-brand/30
                  hover:shadow-[0_30px_70px_-38px_rgba(23,49,96,0.5)]
                "
              >
                {/* =========================================
                    IMAGE
                    ========================================= */}

                <div
                  className="
                    relative
                    aspect-[4/3]
                    overflow-hidden
                    bg-[#edf3f8]
                  "
                >
                  <img
                    src={build.image}
                    alt={build.name}
                    loading="lazy"
                    className="
                      h-full
                      w-full
                      object-cover

                      transition-transform
                      duration-700
                      ease-out

                      group-hover:scale-110
                    "
                  />

                  {/* Keep only a light image-depth overlay */}
                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/30
                      via-transparent
                      to-black/[0.03]
                    "
                  />

                  {/* Badge */}
                  <span
                    className="
                      absolute
                      left-3
                      top-3

                      rounded-md

                      border
                      border-white/55

                      bg-white/90

                      px-2.5
                      py-1

                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-brand

                      shadow-sm
                      backdrop-blur-md
                    "
                  >
                    {build.badge}
                  </span>
                </div>

                {/* =========================================
                    BUILD CONTENT
                    ========================================= */}

                <div
                  className="
                    flex
                    flex-1
                    flex-col
                    p-6
                  "
                >
                  <h3
                    className="
                      font-display
                      text-2xl
                      font-extrabold
                      text-brand-deep

                      transition-colors
                      duration-300

                      group-hover:text-brand
                    "
                  >
                    {build.name}
                  </h3>

                  <p
                    className="
                      mt-0.5

                      text-sm
                      font-semibold
                      uppercase
                      tracking-widest
                      text-brand-soft
                    "
                  >
                    {build.role}
                  </p>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-relaxed
                      text-slate-600
                    "
                  >
                    {build.description}
                  </p>

                  {/* =======================================
                      BUILD SPECS
                      ======================================= */}

                  <ul className="mt-4 space-y-2.5">
                    {build.specs.map((spec) => (
                      <li
                        key={spec}
                        className="
                          flex
                          items-center
                          gap-2

                          text-sm
                          font-medium
                          text-slate-600
                        "
                      >
                        <span
                          className="
                            grid
                            h-5
                            w-5
                            shrink-0
                            place-items-center

                            rounded-full
                            bg-brand/[0.08]
                          "
                        >
                          <Check className="h-3.5 w-3.5 text-brand" />
                        </span>

                        {spec}
                      </li>
                    ))}
                  </ul>

                  {/* =======================================
                      CONFIGURE CTA
                      ======================================= */}

                  <a
                    href="#contact"
                    className="
                      mt-6
                      inline-flex
                      items-center
                      gap-2
                      self-start

                      rounded-lg

                      border
                      border-brand/18

                      bg-white

                      px-5
                      py-2.5

                      font-display
                      text-xs
                      font-bold
                      uppercase
                      tracking-widest
                      text-brand-deep

                      shadow-[0_10px_26px_-22px_rgba(23,49,96,0.45)]

                      transition-all
                      duration-300

                      hover:border-brand/40
                      hover:bg-brand/[0.05]
                      hover:text-brand
                    "
                  >
                    Configure This Build

                    <ArrowRight
                      className="
                        h-4
                        w-4

                        transition-transform
                        duration-300

                        group-hover:translate-x-1
                      "
                    />
                  </a>
                </div>
              </SpotlightCard>
            </BlurReveal>
          ))}
        </ScrollSkew>
      </div>
    </section>
  );
}