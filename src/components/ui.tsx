"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, useScroll, useSpring } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedWords({
  text,
  accents = [],
  className = "",
  delay = 0,
}: {
  text: string;
  accents?: string[];
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => {
        const isAccent = accents.includes(w);
        return (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className={`inline-block ${isAccent ? "text-brand" : ""}`}
              initial={{ y: "112%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: delay + i * 0.07, ease: EASE }}
            >
              {w}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  accent?: string | string[];
  subtitle?: string;
  align?: "center" | "left";
}) {
  const isCenter = align === "center";
  const accents = accent ? (Array.isArray(accent) ? accent : [accent]) : [];
  return (
    <div className={`flex flex-col ${isCenter ? "items-center text-center" : "items-start text-left"}`}>
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-brand">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
          {eyebrow}
        </span>
      </Reveal>
      <h2 className="mt-5 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
        <AnimatedWords text={title} accents={accents} />
      </h2>
      {subtitle ? (
        <Reveal delay={0.14}>
          <p className={`mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400 ${isCenter ? "mx-auto" : ""}`}>
            {subtitle}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

export function CountUp({
  value,
  suffix = "",
  decimals = 0,
  duration = 2,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, value, decimals, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export function SpotlightCard({
  children,
  className = "",
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    "perspective(1000px) rotateX(0deg) rotateY(0deg)",
  );
  const [spot, setSpot] = useState({ opacity: 0, x: 50, y: 50 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * max * 2;
    const ry = (px - 0.5) * max * 2;
    setTransform(
      `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale3d(1.02,1.02,1.02)`,
    );
    setSpot({ opacity: 1, x: px * 100, y: py * 100 });
  }

  function onLeave() {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg)");
    setSpot((s) => ({ ...s, opacity: 0 }));
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transform, transition: "transform 0.2s ease-out" }}
      className={`relative overflow-hidden will-change-transform ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: spot.opacity,
          background: `radial-gradient(560px circle at ${spot.x}% ${spot.y}%, rgba(255,0,0,0.18), transparent 65%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: spot.opacity,
          background: `radial-gradient(360px circle at ${spot.x}% ${spot.y}%, rgba(255,255,255,0.1), transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
}

export function Magnetic({
  children,
  className = "",
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 18, mass: 0.6 });
  const y = useSpring(0, { stiffness: 200, damping: 18, mass: 0.6 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`glitch ${className}`} data-text={text}>
      {text}
    </span>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-brand-deep via-brand to-brand-soft"
    />
  );
}

export function Particles({ count = 18, className = "" }: { count?: number; className?: string }) {
  const dots = Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: (i * 37 + 13) % 100,
    top: (i * 53 + 7) % 100,
    size: 2 + (i % 3),
    delay: (i % 9) * 0.7,
    duration: 6 + (i % 5) * 1.8,
  }));

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-brand/70"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size }}
          animate={{ y: [0, -22, 0], opacity: [0.15, 0.75, 0.15] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function ParticleField({ className = "", color = "255,0,0" }: { className?: string; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.min(75, Math.floor((w * h) / 22000));
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.5 + 0.6,
        });
      }
    };

    const step = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 120 && d > 0) {
          p.x += (dx / d) * 0.7;
          p.y += (dy / d) * 0.7;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},0.55)`;
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${color},${((1 - d / 110) * 0.2).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(step);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    raf = requestAnimationFrame(step);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [color]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

export function Marquee({ reverse = false, className = "" }: { reverse?: boolean; className?: string }) {
  const items = [
    "Custom Builds",
    "Flagship Graphics Cards",
    "High-Speed Memory",
    "Gaming Processors",
    "High-Refresh Monitors",
    "Water Cooling",
    "Mechanical Keyboards",
    "RGB Everything",
  ];
  const row = [...items, ...items];

  return (
    <div className={`relative overflow-hidden border-y border-brand/30 bg-ink-2/80 py-4 ${className}`}>
      <div className={`flex w-max gap-10 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {row.map((item, i) => (
          <div key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span className="font-display text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
              {item}
            </span>
            <span className="text-brand">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
