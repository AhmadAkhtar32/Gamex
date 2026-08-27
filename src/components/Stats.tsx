import { stats } from "@/lib/data";
import { CountUp } from "./ui";
import { BlurReveal } from "./fx";

export function Stats() {
  return (
    <section
      className="
        relative
        overflow-hidden
        border-y
        border-brand/10
        bg-[#f7f9fc]/90
      "
    >
      {/* Animated blue accent line */}
      <div
        className="
          animated-gradient
          absolute
          inset-x-0
          top-0
          h-px
          [background-image:linear-gradient(90deg,transparent,#173160,#6f93c9,#173160,transparent)]
        "
      />

      {/* Soft ambient blue glow */}
      <div
        className="
          absolute
          left-1/2
          top-0
          -z-10
          h-40
          w-[30rem]
          -translate-x-1/2
          rounded-full
          bg-brand/[0.07]
          blur-[100px]
        "
      />

      <div
        className="
          mx-auto
          grid
          max-w-7xl
          grid-cols-2
          lg:grid-cols-4
        "
      >
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`
              group
              relative
              flex
              flex-col
              items-center
              gap-2

              px-4
              py-10
              text-center

              transition-colors
              duration-300

              md:py-12

              ${
                index > 0
                  ? "border-l border-brand/10"
                  : ""
              }

              ${
                index % 2 === 1
                  ? "border-l-0 lg:border-l"
                  : ""
              }
            `}
          >
            {/* Very subtle hover background */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-brand/[0.035]
                opacity-0
                transition-opacity
                duration-300
                group-hover:opacity-100
              "
            />

            <BlurReveal delay={index * 0.08}>
              <div
                className="
                  relative
                  z-10

                  font-display
                  text-4xl
                  font-black
                  text-brand-deep

                  transition-all
                  duration-300

                  group-hover:-translate-y-1
                  group-hover:text-brand

                  md:text-5xl
                "
              >
                <CountUp
                  value={stat.value}
                  decimals={stat.decimals}
                  suffix={stat.suffix}
                />
              </div>

              <p
                className="
                  relative
                  z-10

                  mt-2

                  text-sm
                  font-semibold
                  uppercase
                  tracking-widest
                  text-slate-500

                  transition-colors
                  duration-300

                  group-hover:text-slate-600
                "
              >
                {stat.label}
              </p>
            </BlurReveal>
          </div>
        ))}
      </div>
    </section>
  );
}