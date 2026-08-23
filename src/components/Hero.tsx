"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { Cpu, Gauge, MousePointerClick, Zap } from "lucide-react";
import { GlitchText, Magnetic } from "./ui";
import { MouseIndicator, ScrambleText } from "./fx";
import { useReady } from "./chrome";

const WORDS = ["MATCH.", "RAID.", "BATTLE.", "FRAME."];

const container: Variants = { hidden: {}, show: {} };
const item: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Hero() {
  const ready = useReady();
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setWordIndex((v) => (v + 1) % WORDS.length), 2300);
    return () => clearInterval(t);
  }, []);

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [7, -7]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [-7, 7]);
  const chip1x = useTransform(sx, [-0.5, 0.5], [-20, 20]);
  const chip1y = useTransform(sy, [-0.5, 0.5], [-14, 14]);
  const chip2x = useTransform(sx, [-0.5, 0.5], [16, -16]);
  const chip3x = useTransform(sx, [-0.5, 0.5], [-12, 12]);

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <section
      id="home"
      onMouseMove={onMouseMove}
      className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-40"
    >
      {/* Background layers */}
      <div className="bg-grid grid-animated absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,black,transparent)]" />
      <div className="stripes-red absolute inset-0 -z-10 opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      <div className="radar-sweep absolute left-1/2 top-1/2 -z-10 h-[70rem] w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50" />
      <div className="red-scan absolute inset-x-0 top-0 -z-10 h-44 bg-gradient-to-b from-transparent via-brand/15 to-transparent" />
      <div className="animate-orb absolute -left-40 -top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-brand/30 blur-[130px]" />
      <div className="animate-pulse-glow absolute -right-40 top-24 -z-10 h-[30rem] w-[30rem] rounded-full bg-brand/20 blur-[120px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2">
        {/* Left column */}
        <motion.div initial="hidden" animate={ready ? "show" : "hidden"} variants={container}>
          <motion.span variants={item} custom={0} className="inline-block">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-brand">
              <Zap className="h-3.5 w-3.5" />
              <ScrambleText text="Premium Gaming Hardware" duration={1200} />
            </span>
          </motion.span>

          <h1 className="mt-6 font-display text-4xl font-black uppercase leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            <span className="block">
              <motion.span variants={item} custom={1} className="inline-block">
                Dominate
              </motion.span>
            </span>
            <span className="block">
              <motion.span variants={item} custom={2} className="inline-block">
                every&nbsp;
              </motion.span>
              <motion.span variants={item} custom={3} className="inline-block align-bottom text-brand">
                <span className="relative inline-block overflow-hidden align-bottom">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={WORDS[wordIndex]}
                      initial={{ y: "105%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "-105%", opacity: 0 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="inline-block"
                    >
                      <GlitchText text={WORDS[wordIndex]} />
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={item}
            custom={4}
            className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400 md:text-xl"
          >
            Gamex builds custom high-performance gaming PCs and supplies pro-grade graphics cards,
            memory, processors and accessories — engineered for players who refuse to lose.
          </motion.p>

          <motion.div variants={item} custom={5} className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href="#builds"
                className="cta-pulse group inline-flex items-center gap-2 rounded-lg bg-brand px-7 py-3.5 font-display text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-brand-soft"
              >
                Explore Builds
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                href="#products"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-7 py-3.5 font-display text-sm font-bold uppercase tracking-widest text-white/90 transition-all duration-300 hover:border-brand/60 hover:text-white"
              >
                Shop Components
              </a>
            </Magnetic>
          </motion.div>

          <motion.div
            variants={item}
            custom={6}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-zinc-500"
          >
            <span className="inline-flex items-center gap-2">
              <Gauge className="h-4 w-4 text-brand" /> Benchmark-tested
            </span>
            <span className="inline-flex items-center gap-2">
              <Cpu className="h-4 w-4 text-brand" /> Certified silicon
            </span>
            <span className="inline-flex items-center gap-2">
              <MousePointerClick className="h-4 w-4 text-brand" /> 12,000+ happy gamers
            </span>
          </motion.div>
        </motion.div>

        {/* Right column — hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-xl"
        >
          {/* Rotating dashed frame behind card */}
          <div className="animate-spin-slow absolute -inset-9 -z-20 rounded-[3rem] border border-dashed border-brand/20 [animation-duration:50s]" />

          <motion.div
            style={{ rotateX, rotateY, transformPerspective: 1100 }}
            className="relative"
          >
            <div className="animate-pulse-glow absolute -inset-6 -z-10 rounded-[2rem] bg-brand/15 blur-3xl" />

            {/* Rotating conic ring */}
            <div className="animate-spin-slow absolute -inset-[2px] rounded-[1.9rem] opacity-70 [background:conic-gradient(from_0deg,transparent_0%,#ff0000_25%,transparent_50%,#ff0000_75%,transparent_100%)]" />

            <div className="glow relative overflow-hidden rounded-[1.75rem] border border-brand/25 bg-ink-2">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/34301924/pexels-photo-34301924.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                  alt="Gamex custom gaming PC with RGB lighting"
                  className="animate-kenburns h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="scanline" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div>
                    <p className="font-display text-sm font-bold uppercase tracking-wider text-white">
                      Titan Series
                    </p>
                    <p className="text-xs uppercase tracking-widest text-zinc-400">Flagship Build</p>
                  </div>
                  <span className="rounded-md border border-brand/40 bg-black/60 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-brand backdrop-blur">
                    Live
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating spec chips (parallax) */}
          <motion.div style={{ x: chip1x, y: chip1y }} className="absolute -left-4 top-8 sm:-left-8">
            <div className="animate-float rounded-xl border border-white/10 bg-black/70 px-4 py-3 backdrop-blur-md">
              <p className="font-display text-lg font-extrabold text-white">Flagship GPU</p>
              <p className="text-xs uppercase tracking-widest text-zinc-400">Next-gen VRAM</p>
            </div>
          </motion.div>

          <motion.div style={{ x: chip2x }} className="absolute -right-3 top-1/2 sm:-right-8">
            <div className="animate-float-slow rounded-xl border border-white/10 bg-black/70 px-4 py-3 backdrop-blur-md">
              <p className="font-display text-lg font-extrabold text-white">High-Capacity</p>
              <p className="text-xs uppercase tracking-widest text-zinc-400">Blazing Fast Memory</p>
            </div>
          </motion.div>

          <motion.div style={{ x: chip3x }} className="absolute -bottom-5 left-8">
            <div className="animate-float rounded-xl border border-brand/30 bg-black/70 px-4 py-3 backdrop-blur-md">
              <p className="font-display text-lg font-extrabold text-brand">300+ FPS</p>
              <p className="text-xs uppercase tracking-widest text-zinc-400">Esports Ready</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 1.4 }}
        className="mt-14 flex justify-center"
      >
        <MouseIndicator />
      </motion.div>
    </section>
  );
}
