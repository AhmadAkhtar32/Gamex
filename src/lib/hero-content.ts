/* =========================================================
   HERO MEDIA TYPE
   ========================================================= */

export type HeroMediaItem = {
  id: number;

  mediaType:
    | "image"
    | "video";

  url: string;

  alt: string;

  sortOrder: number;
};

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

  /*
   * Legacy image fields.
   *
   * They are kept temporarily so the old Hero image can
   * remain visible until Slider media is added.
   */
  image?: string;

  imageAlt?: string;

  isVisible: boolean;
};

/* =========================================================
   DEFAULT HERO CONTENT
   ========================================================= */

export const DEFAULT_HERO_CONTENT: HeroContent = {
  id:
    "main",

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

  /*
   * Temporary fallback.
   *
   * Once Hero slider media exists in the database,
   * the slider uses that instead.
   */
  image:
    "https://images.pexels.com/photos/34301924/pexels-photo-34301924.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",

  imageAlt:
    "Gamex custom gaming PC with RGB lighting",

  isVisible:
    true,
};