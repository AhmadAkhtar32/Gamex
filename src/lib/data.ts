export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "Custom Builds", href: "#builds" },
  { label: "Why Gamex", href: "#features" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export type Stat = {
  value: number;
  decimals?: number;
  suffix: string;
  label: string;
};

export const stats: Stat[] = [
  { value: 12, suffix: "K+", label: "Gamers Equipped" },
  { value: 3.5, decimals: 1, suffix: "K+", label: "Custom Builds" },
  { value: 48, suffix: "h", label: "Avg. Build Time" },
  { value: 24, suffix: "/7", label: "Tech Support" },
];

export type Feature = {
  icon: string;
  title: string;
  description: string;
};

export const features: Feature[] = [
  {
    icon: "wrench",
    title: "Custom-Built To Win",
    description: "Every rig is hand-assembled, cable-managed and stress-tested for 12+ hours before it ships.",
  },
  {
    icon: "shield",
    title: "Certified Components",
    description: "We only stock authentic, warrantied hardware from the world's leading silicon makers.",
  },
  {
    icon: "gauge",
    title: "Performance Tuning",
    description: "Optimized settings, memory profiles and GPU tuning dialed in before your machine leaves the bench.",
  },
  {
    icon: "badge",
    title: "Up To 3-Year Warranty",
    description: "Lifetime tech support and a no-quibble warranty so you can game without the worry.",
  },
  {
    icon: "zap",
    title: "48hr Express Build",
    description: "Our benchmark-tested build pipeline turns around most custom rigs in just two days.",
  },
  {
    icon: "refresh",
    title: "Trade-In Program",
    description: "Swap your old graphics card, processor or full tower for credit toward your next upgrade.",
  },
];

export type CategoryId =
  | "all"
  | "custom-pcs"
  | "graphics-cards"
  | "ram"
  | "processors"
  | "accessories";

export type Category = { id: CategoryId; label: string };

export const categories: Category[] = [
  { id: "all", label: "All" },
  { id: "custom-pcs", label: "Custom PCs" },
  { id: "graphics-cards", label: "Graphics Cards" },
  { id: "ram", label: "Memory" },
  { id: "processors", label: "Processors" },
  { id: "accessories", label: "Accessories" },
];

export type Product = {
  id: string;
  name: string;
  category: Exclude<CategoryId, "all">;
  tag: string;
  description: string;
  specs: string[];
  image: string;
};

const img = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`;

export const products: Product[] = [
  // Custom PCs
  {
    id: "pc-titan",
    name: "Titan Series Build",
    category: "custom-pcs",
    tag: "Flagship",
    description: "Our most powerful build — fully liquid-cooled for uncompromising 4K gaming and streaming.",
    specs: ["Top-tier processor", "Flagship GPU", "High-capacity memory", "Custom liquid cooling"],
    image: img(34301924),
  },
  {
    id: "pc-vortex",
    name: "Vortex Series Build",
    category: "custom-pcs",
    tag: "High-End",
    description: "A perfectly balanced powerhouse built for serious gamers and content creators.",
    specs: ["High-end processor", "Premium GPU", "Dual-channel memory", "Advanced AIO cooling"],
    image: img(30469968),
  },
  {
    id: "pc-stealth",
    name: "Stealth Series Build",
    category: "custom-pcs",
    tag: "Mini-ITX",
    description: "A compact powerhouse that disappears under your desk without giving up an ounce of speed.",
    specs: ["High-core processor", "Premium GPU", "Fast memory", "Compact chassis"],
    image: img(424436),
  },
  {
    id: "pc-striker",
    name: "Striker Series Build",
    category: "custom-pcs",
    tag: "Competitive",
    description: "The esports workhorse — tuned for maximum frames and minimal input latency.",
    specs: ["Gaming-tuned processor", "High-refresh GPU", "Low-latency memory", "Tournament ready"],
    image: img(2643596),
  },

  // Graphics cards
  {
    id: "gpu-flagship",
    name: "Flagship Graphics Card",
    category: "graphics-cards",
    tag: "Flagship",
    description: "Our fastest GPU for uncompromising 4K and high-end content creation.",
    specs: ["Next-gen architecture", "Flagship VRAM", "Advanced ray tracing", "Triple-fan cooling"],
    image: img(34552790),
  },
  {
    id: "gpu-high-end",
    name: "High-End Graphics Card",
    category: "graphics-cards",
    tag: "Performance",
    description: "Serious 4K muscle with world-class efficiency and premium cooling.",
    specs: ["High-bandwidth memory", "Ray tracing", "Vapor-chamber cooler", "RGB accents"],
    image: img(34552794),
  },
  {
    id: "gpu-performance",
    name: "Performance Graphics Card",
    category: "graphics-cards",
    tag: "1440p",
    description: "The high-refresh sweet spot for smooth, competitive play at 1440p.",
    specs: ["High-bandwidth memory", "Ray tracing", "Dual BIOS", "Silent cooling"],
    image: img(34552804),
  },
  {
    id: "gpu-value",
    name: "Value Graphics Card",
    category: "graphics-cards",
    tag: "Value",
    description: "A solid performer for smooth 1080p and esports gaming without the premium tag.",
    specs: ["Fast memory", "Efficient design", "Dual-fan cooling", "Modern encode support"],
    image: img(8622912),
  },

  // RAM
  {
    id: "ram-speed",
    name: "High-Speed Memory Kit",
    category: "ram",
    tag: "Performance",
    description: "Low-latency memory tuned for maximum gaming performance and responsiveness.",
    specs: ["Dual-channel kit", "High frequency", "Low latency", "Addressable RGB"],
    image: img(33384161),
  },
  {
    id: "ram-capacity",
    name: "High-Capacity Memory Kit",
    category: "ram",
    tag: "Capacity",
    description: "Premium heat-spreaders and tight timings for high-bandwidth, memory-hungry builds.",
    specs: ["Large capacity", "Fast speeds", "Error correction", "Aluminum spreaders"],
    image: img(31993524),
  },
  {
    id: "ram-legacy",
    name: "Reliable Memory Kit",
    category: "ram",
    tag: "Value",
    description: "Budget-friendly performance for older platforms that still pack a punch.",
    specs: ["Dual-channel kit", "High frequency", "Low latency", "Profile ready"],
    image: img(28657061),
  },

  // Processors
  {
    id: "cpu-flagship",
    name: "Flagship Gaming Processor",
    category: "processors",
    tag: "Gaming",
    description: "The ultimate chip for gaming and heavy multitasking in a single machine.",
    specs: ["High core count", "Fast boost clocks", "3D cache technology", "Latest socket"],
    image: img(32300577),
  },
  {
    id: "cpu-creator",
    name: "High-Performance Processor",
    category: "processors",
    tag: "Creator",
    description: "A high-frequency flagship built for creators, streamers and frame-chasers.",
    specs: ["High core count", "Extreme boost", "Large cache", "Overclockable"],
    image: img(3665444),
  },
  {
    id: "cpu-esports",
    name: "Gaming-Tuned Processor",
    category: "processors",
    tag: "Esports",
    description: "The undisputed gaming king with massive cache for staggering frame rates.",
    specs: ["High core count", "Fast boost", "3D cache", "Latest socket"],
    image: img(37113174),
  },

  // Accessories
  {
    id: "acc-keyboard",
    name: "Mechanical Keyboard",
    category: "accessories",
    tag: "Peripheral",
    description: "A hot-swappable mechanical board with buttery stabilizers and per-key RGB.",
    specs: ["Hot-swap switches", "High polling rate", "PBT keycaps", "Per-key RGB"],
    image: img(7047612),
  },
  {
    id: "acc-mouse",
    name: "Wireless Gaming Mouse",
    category: "accessories",
    tag: "Peripheral",
    description: "An ultralight weapon with a pro-grade sensor and lag-free wireless.",
    specs: ["Pro-grade sensor", "Ultralight shell", "Low-latency wireless", "Long battery life"],
    image: img(2115256),
  },
  {
    id: "acc-headset",
    name: "Surround Sound Headset",
    category: "accessories",
    tag: "Audio",
    description: "Hear footsteps before they see you — spatial audio with a broadcast-grade mic.",
    specs: ["Surround sound", "Large drivers", "Noise-cancel mic", "Memory foam"],
    image: img(28993064),
  },
  {
    id: "acc-monitor",
    name: "High-Refresh Monitor",
    category: "accessories",
    tag: "Monitor",
    description: "A crisp QHD panel with lightning response for silky-smooth motion.",
    specs: ["QHD resolution", "High refresh rate", "Fast response", "Adaptive sync"],
    image: img(7858742),
  },
  {
    id: "acc-deskpad",
    name: "RGB Desk Pad XL",
    category: "accessories",
    tag: "Desk",
    description: "A precision micro-weave surface sized for your full battle station.",
    specs: ["Extra-large", "Micro-weave", "Non-slip base", "Stitched edge"],
    image: img(27679707),
  },
  {
    id: "acc-bundle",
    name: "Command Deck Bundle",
    category: "accessories",
    tag: "Bundle",
    description: "Everything for a complete, synced setup — peripherals, desk and setup consultation.",
    specs: ["Full RGB sync", "Peripherals + desk", "Cable management", "Setup consult"],
    image: img(9128853),
  },
];

export type Build = {
  name: string;
  badge: string;
  role: string;
  description: string;
  specs: string[];
  image: string;
};

export const builds: Build[] = [
  {
    name: "Titan Series",
    badge: "Flagship",
    role: "For 4K Gaming",
    description:
      "A no-compromise liquid-cooled beast that shrugs off 4K ultra settings. Built for the player who wants it all.",
    specs: ["Top-tier processor", "Flagship GPU", "High-capacity memory", "Custom hardline loop"],
    image: img(34301924),
  },
  {
    name: "Vortex Series",
    badge: "Best Seller",
    role: "For Creators",
    description:
      "Stream, render and game at once — the Vortex Series balances multi-core muscle with serious GPU grunt.",
    specs: ["Gaming processor", "Premium GPU", "Dual-channel memory", "Large AIO cooling"],
    image: img(30469968),
  },
  {
    name: "Stealth Series",
    badge: "SFF",
    role: "Mini-ITX Power",
    description:
      "A small-form-factor silent operator. Full desktop performance in a chassis that fits anywhere.",
    specs: ["High-core processor", "Premium GPU", "Fast memory", "Compact chassis"],
    image: img(424436),
  },
];

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  image: string;
  readTime: string;
  date: string;
};

export const seedBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "5 Mistakes to Avoid When Building Your First Gaming PC",
    slug: "5-mistakes-first-gaming-pc",
    category: "Build Guide",
    excerpt:
      "From unbalanced part choices to skipping airflow, these are the beginner pitfalls that cost frames — and how to dodge them.",
    image: img(7859348),
    readTime: "6 min read",
    date: "2026-01-28",
  },
  {
    id: 2,
    title: "Does Faster RAM Actually Matter for Gaming?",
    slug: "faster-ram-gaming-benchmarks",
    category: "Memory",
    excerpt:
      "We benchmark real-world titles to find out whether that pricey high-speed memory kit is worth the upgrade, or just a spec-sheet flex.",
    image: img(31993524),
    readTime: "4 min read",
    date: "2026-01-19",
  },
  {
    id: 3,
    title: "How to Keep Your GPU Cool: Airflow & Cooling Guide",
    slug: "gpu-cooling-airflow-guide",
    category: "Cooling",
    excerpt:
      "Thermal throttling is silently stealing your FPS. Here's how to build a case with airflow that keeps your card boosting.",
    image: img(34552811),
    readTime: "5 min read",
    date: "2026-01-07",
  },
  {
    id: 4,
    title: "The Ultimate 2026 PC Build for 4K Gaming",
    slug: "ultimate-2026-4k-gaming-build",
    category: "Builds",
    excerpt:
      "What does it actually take to drive 4K at high refresh rates? We spec out the dream rig — and a sensible alternative.",
    image: img(33050962),
    readTime: "8 min read",
    date: "2025-12-22",
  },
];
