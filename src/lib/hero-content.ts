/* =========================================================
   HERO CONTENT TYPE
   ========================================================= */

export type HeroContent = {
  id: string;

  eyebrow: string;

  headingLine1: string;
  headingLine2: string;

  rotatingWords: string[];

  description: string;

  primaryButtonText: string;
  primaryButtonLink: string;

  secondaryButtonText: string;
  secondaryButtonLink: string;

  trustPoint1: string;
  trustPoint2: string;
  trustPoint3: string;

  image: string;
  imageAlt: string;

  imageTitle: string;
  imageSubtitle: string;
  imageBadge: string;

  chip1Title: string;
  chip1Subtitle: string;

  chip2Title: string;
  chip2Subtitle: string;

  chip3Title: string;
  chip3Subtitle: string;

  isVisible: boolean;
};

/* =========================================================
   DEFAULT HERO CONTENT

   Used when the database does not yet contain Hero settings.
   ========================================================= */

export const DEFAULT_HERO_CONTENT: HeroContent = {
  id: "main",

  eyebrow:
    "Premium Gaming Hardware",

  headingLine1:
    "Dominate",

  headingLine2:
    "every",

  rotatingWords: [
    "MATCH.",
    "RAID.",
    "BATTLE.",
    "FRAME.",
  ],

  description:
    "Gamex builds custom high-performance gaming PCs and supplies pro-grade graphics cards, memory, processors and accessories — engineered for players who refuse to lose.",

  primaryButtonText:
    "Explore Builds",

  primaryButtonLink:
    "#builds",

  secondaryButtonText:
    "Shop Components",

  secondaryButtonLink:
    "#products",

  trustPoint1:
    "Benchmark-tested",

  trustPoint2:
    "Certified silicon",

  trustPoint3:
    "12,000+ happy gamers",

  image:
    "https://images.pexels.com/photos/34301924/pexels-photo-34301924.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",

  imageAlt:
    "Gamex custom gaming PC with RGB lighting",

  imageTitle:
    "Titan Series",

  imageSubtitle:
    "Flagship Build",

  imageBadge:
    "Live",

  chip1Title:
    "Flagship GPU",

  chip1Subtitle:
    "Next-gen VRAM",

  chip2Title:
    "High-Capacity",

  chip2Subtitle:
    "Blazing Fast Memory",

  chip3Title:
    "300+ FPS",

  chip3Subtitle:
    "Esports Ready",

  isVisible: true,
};