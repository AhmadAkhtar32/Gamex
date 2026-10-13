"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, ChevronUp, Images } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/price";
import { BlurReveal, ScrollSkew } from "./fx";

export type PublicBuild = {
  id: string;
  name: string;
  role: string;
  badge: string;
  price: number | null;
  description: string;
  specs: string[];
  image: string;
  images?: string[];
};

function getBuildImages(build: PublicBuild) {
  const values = [build.image, ...(build.images ?? [])]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
  return Array.from(new Set(values));
}

function getBuildLimit(
  width = typeof window === "undefined" ? 0 : window.innerWidth
) {
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

export function Builds({ builds }: { builds: PublicBuild[] }) {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const [initialLimit, setInitialLimit] = useState(1);

  useEffect(() => {
    const updateLimit = () => setInitialLimit(getBuildLimit());
    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  const visibleBuilds = showAll ? builds : builds.slice(0, initialLimit);
  const canToggle = builds.length > initialLimit;

  function toggleBuilds() {
    if (showAll) {
      setShowAll(false);
      window.setTimeout(() => {
        document.getElementById("builds")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
      return;
    }
    setShowAll(true);
  }

  return (
    <section
      id="builds"
      aria-labelledby="custom-builds-heading"
      className="relative overflow-hidden bg-white pb-6 pt-3 md:pb-8 md:pt-4"
    >
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <header className="text-center">
          <div className="inline-flex max-w-full items-center gap-3 rounded-2xl border border-brand/20 bg-white px-5 py-3 shadow-[0_3px_14px_-5px_rgba(230,0,0,0.18)] sm:px-6">
            {/* <span
              aria-hidden="true"
              className="h-8 w-1 shrink-0 rounded-full bg-brand shadow-[0_0_8px_rgba(230,0,0,0.25)] sm:h-10"
            /> */}
            <h2
              id="custom-builds-heading"
              className="min-w-0 break-words font-display text-2xl font-extrabold uppercase leading-tight text-brand-deep sm:text-3xl"
            >
              <span className="text-brand">Custom</span> Builds
            </h2>
          </div>
          <p className="mt-1 font-sans text-xs font-semibold text-slate-600">
            Built for your playstyle
          </p>
          <p className="mx-auto mt-2 max-w-3xl font-sans text-sm leading-6 text-slate-500">
            Signature gaming rigs, tuned and stress-tested for performance.
            Configure one of our systems or design your own from scratch.
          </p>
        </header>
        {builds.length > 0 ? (
          <>
            <ScrollSkew
              amount={2}
              className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            >
              {visibleBuilds.map((build, index) => {
                const buildImages = getBuildImages(build);
                const mainImage = buildImages[0] ?? build.image;
                return (
                  <BlurReveal
                    key={build.id}
                    delay={index * 0.06}
                    className="h-full min-w-0"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for ${build.name}`}
                      onClick={() =>
                        router.push(`/build/${encodeURIComponent(build.id)}`)
                      }
                      onKeyDown={(event) => {
                        if (event.target !== event.currentTarget) return;
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          router.push(
                            `/build/${encodeURIComponent(build.id)}`
                          );
                        }
                      }}
                      className="h-full min-w-0 cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/15"
                    >
                      <div className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_20px_55px_-38px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1">
                        <div className="relative aspect-[4/3] overflow-hidden border-b border-black/[0.05] bg-[#f4f4f4]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={mainImage}
                            alt={`${build.name} custom gaming PC build at GameX Pakistan`}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.045]"
                          />
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/[0.055] via-transparent to-transparent"
                          />
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/[0.025]"
                          />
                          <span className="absolute left-3 top-3 z-20 rounded-full border border-brand/20 bg-white/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-brand shadow-[0_8px_22px_-16px_rgba(230,0,0,0.5)] backdrop-blur-md">
                            {build.badge}
                          </span>
                          {buildImages.length > 1 && (
                            <span className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1.5 text-[9px] font-bold text-white backdrop-blur-md">
                              <Images className="h-3 w-3" />
                              {buildImages.length}
                            </span>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col p-5">
                          <h3 className="font-display text-2xl font-extrabold leading-tight text-brand-deep transition-colors">
                            {build.name}
                          </h3>
                          <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                            {build.role}
                          </p>
                          <div className="mt-3 w-full min-w-0 rounded-lg bg-brand px-3 py-2.5">
                            <p className="font-sans text-[10px] font-semibold leading-4 text-white/80">
                              Starting Price
                            </p>
                            <p className="mt-0.5 break-words font-sans text-lg font-bold leading-6 tracking-tight text-white tabular-nums">
                              {formatPrice(build.price)}
                            </p>
                          </div>
                          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                            {build.description}
                          </p>
                          <ul className="mt-4 space-y-2 border-t border-black/[0.06] pt-3">
                            {build.specs.slice(0, 4).map((spec, specIndex) => (
                              <li
                                key={`${build.id}-${specIndex}`}
                                className="flex items-start gap-2 text-xs leading-relaxed text-slate-600"
                              >
                                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand/[0.08] text-brand">
                                  <Check className="h-2.5 w-2.5" />
                                </span>
                                <span className="min-w-0 flex-1">{spec}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-auto grid gap-2 pt-5">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                router.push(
                                  `/build/${encodeURIComponent(build.id)}`
                                );
                              }}
                              className="inline-flex min-h-11 w-full min-w-0 items-center justify-between gap-2 whitespace-normal rounded-xl border border-brand/15 bg-white px-4 py-3 text-left text-xs font-bold uppercase leading-snug tracking-wider text-brand-deep transition-all hover:border-brand hover:bg-brand hover:text-white"
                            >
                              View Details
                              <ArrowRight className="h-4 w-4 shrink-0" />
                            </button>
                            <Link
                              href={`/build/${build.id}`}
                              onClick={(event) => event.stopPropagation()}
                              onKeyDown={(event) => event.stopPropagation()}
                              className="inline-flex min-h-11 w-full min-w-0 items-center justify-between gap-2 whitespace-normal rounded-xl bg-brand px-4 py-3 text-left text-xs font-bold uppercase leading-snug tracking-wider text-white transition-all hover:-translate-y-0.5 hover:bg-brand-soft"
                            >
                              Build Page
                              <ArrowRight className="h-4 w-4 shrink-0" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </BlurReveal>
                );
              })}
            </ScrollSkew>
            {canToggle && (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={toggleBuilds}
                  className="group inline-flex min-w-[175px] items-center justify-center gap-2.5 rounded-xl border border-brand/20 bg-white px-6 py-3.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-brand shadow-[0_12px_32px_-22px_rgba(230,0,0,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white"
                >
                  {showAll ? "Show Less" : "View More"}
                  {showAll ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-brand/20 bg-white px-6 py-14 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl border border-brand/15 bg-brand/[0.06]" />
            <h3 className="mt-4 font-display text-xl font-bold uppercase text-brand-deep">
              Custom Builds Coming Soon
            </h3>
          </div>
        )}
      </div>
    </section>
  );
}