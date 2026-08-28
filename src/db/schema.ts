import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/* =========================================================
   CONTACT MESSAGES
   ========================================================= */

export const contactMessages = pgTable(
  "contact_messages",
  {
    id: serial("id").primaryKey(),

    name: varchar("name", {
      length: 255,
    }).notNull(),

    email: varchar("email", {
      length: 255,
    }).notNull(),

    subject: varchar("subject", {
      length: 255,
    }).notNull(),

    message: text("message").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  }
);

/* =========================================================
   BLOG POSTS
   ========================================================= */

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: serial("id").primaryKey(),

    title: varchar("title", {
      length: 255,
    }).notNull(),

    slug: varchar("slug", {
      length: 255,
    })
      .notNull()
      .unique(),

    category: varchar("category", {
      length: 100,
    }).notNull(),

    excerpt: text("excerpt").notNull(),

    image: varchar("image", {
      length: 600,
    }).notNull(),

    readTime: varchar("read_time", {
      length: 60,
    }).notNull(),

    publishedAt: timestamp("published_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  }
);

/* =========================================================
   ADMINS
   ========================================================= */

export const admins = pgTable(
  "admins",
  {
    id: serial("id").primaryKey(),

    name: varchar("name", {
      length: 255,
    }).notNull(),

    email: varchar("email", {
      length: 255,
    })
      .notNull()
      .unique(),

    passwordHash: text(
      "password_hash"
    ).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  }
);

/* =========================================================
   ADMIN SESSIONS
   ========================================================= */

export const adminSessions = pgTable(
  "admin_sessions",
  {
    id: serial("id").primaryKey(),

    adminId: integer("admin_id")
      .notNull()
      .references(() => admins.id, {
        onDelete: "cascade",
      }),

    tokenHash: varchar("token_hash", {
      length: 64,
    })
      .notNull()
      .unique(),

    expiresAt: timestamp("expires_at", {
      withTimezone: true,
    }).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  }
);

/* =========================================================
   PRODUCTS
   ========================================================= */

export const products = pgTable(
  "products",
  {
    /*
     * We use a string ID because your current PRODUCTS data
     * already uses string IDs.
     *
     * Examples:
     *
     * product-1
     * gpu-1
     * pc-titan
     */
    id: varchar("id", {
      length: 100,
    }).primaryKey(),

    /*
     * Product title shown publicly.
     */
    name: varchar("name", {
      length: 255,
    }).notNull(),

    /*
     * Current website categories:
     *
     * custom-pcs
     * graphics-cards
     * ram
     * processors
     * accessories
     */
    category: varchar("category", {
      length: 100,
    }).notNull(),

    /*
     * Small label shown on the product card.
     *
     * Examples:
     * NEW
     * BEST SELLER
     * GAMING
     */
    tag: varchar("tag", {
      length: 120,
    }).notNull(),

    description: text(
      "description"
    ).notNull(),

    /*
     * PostgreSQL text array.
     *
     * Example:
     *
     * [
     *   "RTX 5090",
     *   "32GB RAM",
     *   "2TB SSD"
     * ]
     */
    specs: text("specs")
      .array()
      .notNull(),

    /*
     * Image URL.
     *
     * Initially this can continue using your existing
     * Pexels URLs.
     */
    image: varchar("image", {
      length: 1000,
    }).notNull(),

    /*
     * Lets the administrator hide a product without
     * permanently deleting it.
     */
    isVisible: boolean("is_visible")
      .default(true)
      .notNull(),

    /*
     * Controls which product appears first.
     *
     * 1 comes before 2, etc.
     */
    sortOrder: integer("sort_order")
      .default(0)
      .notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  }
);
/* =========================================================
   CUSTOM BUILDS
   ========================================================= */

export const customBuilds = pgTable(
  "custom_builds",
  {
    /*
     * Stable string ID used by admin routes.
     *
     * Examples:
     * titan
     * vortex
     * stealth
     */
    id: varchar("id", {
      length: 100,
    }).primaryKey(),

    /*
     * Public build name.
     *
     * Example:
     * Titan
     */
    name: varchar("name", {
      length: 255,
    }).notNull(),

    /*
     * Short role/subtitle.
     *
     * Example:
     * Ultimate 4K Gaming
     */
    role: varchar("role", {
      length: 255,
    }).notNull(),

    /*
     * Small image badge.
     *
     * Examples:
     * FLAGSHIP
     * PERFORMANCE
     * STEALTH
     */
    badge: varchar("badge", {
      length: 120,
    }).notNull(),

    /*
     * Main build description.
     */
    description: text(
      "description"
    ).notNull(),

    /*
     * One specification per array item.
     *
     * Example:
     *
     * [
     *   "RTX 5090",
     *   "Ryzen 9 9950X3D",
     *   "64GB DDR5",
     *   "4TB NVMe SSD"
     * ]
     */
    specs: text("specs")
      .array()
      .notNull(),

    /*
     * Either:
     *
     * - Cloudinary URL from PC upload
     * - external image URL
     */
    image: varchar("image", {
      length: 1000,
    }).notNull(),

    /*
     * Hide a build from the public website
     * without deleting it.
     */
    isVisible: boolean(
      "is_visible"
    )
      .default(true)
      .notNull(),

    /*
     * Determines card ordering.
     *
     * Example:
     *
     * Titan   = 1
     * Vortex  = 2
     * Stealth = 3
     */
    sortOrder: integer(
      "sort_order"
    )
      .default(0)
      .notNull(),

    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),
  }
);
/* =========================================================
   HERO SETTINGS
   ========================================================= */

export const heroSettings = pgTable(
  "hero_settings",
  {
    /*
     * We only need one main Hero configuration.
     *
     * We will save it using:
     *
     * id = "main"
     */
    id: varchar("id", {
      length: 50,
    }).primaryKey(),

    /* -------------------------------------------------------
       TOP EYEBROW
       ------------------------------------------------------- */

    eyebrow: varchar("eyebrow", {
      length: 255,
    }).notNull(),

    /* -------------------------------------------------------
       MAIN HEADING
       ------------------------------------------------------- */

    /*
     * Current:
     *
     * Dominate
     * every MATCH.
     */

    headingLine1: varchar(
      "heading_line_1",
      {
        length: 255,
      }
    ).notNull(),

    headingLine2: varchar(
      "heading_line_2",
      {
        length: 255,
      }
    ).notNull(),

    /*
     * Current rotating words:
     *
     * MATCH.
     * RAID.
     * BATTLE.
     * FRAME.
     */
    rotatingWords: text(
      "rotating_words"
    )
      .array()
      .notNull(),

    /* -------------------------------------------------------
       DESCRIPTION
       ------------------------------------------------------- */

    description: text(
      "description"
    ).notNull(),

    /* -------------------------------------------------------
       PRIMARY BUTTON
       ------------------------------------------------------- */

    primaryButtonText: varchar(
      "primary_button_text",
      {
        length: 120,
      }
    ).notNull(),

    primaryButtonLink: varchar(
      "primary_button_link",
      {
        length: 500,
      }
    ).notNull(),

    /* -------------------------------------------------------
       SECONDARY BUTTON
       ------------------------------------------------------- */

    secondaryButtonText: varchar(
      "secondary_button_text",
      {
        length: 120,
      }
    ).notNull(),

    secondaryButtonLink: varchar(
      "secondary_button_link",
      {
        length: 500,
      }
    ).notNull(),

    /* -------------------------------------------------------
       TRUST POINTS
       ------------------------------------------------------- */

    trustPoint1: varchar(
      "trust_point_1",
      {
        length: 255,
      }
    ).notNull(),

    trustPoint2: varchar(
      "trust_point_2",
      {
        length: 255,
      }
    ).notNull(),

    trustPoint3: varchar(
      "trust_point_3",
      {
        length: 255,
      }
    ).notNull(),

    /* -------------------------------------------------------
       HERO IMAGE
       ------------------------------------------------------- */

    /*
     * Can contain:
     *
     * Cloudinary URL
     * OR
     * external image URL
     */
    image: varchar("image", {
      length: 1000,
    }).notNull(),

    imageAlt: varchar(
      "image_alt",
      {
        length: 500,
      }
    ).notNull(),

    /* -------------------------------------------------------
       TEXT DISPLAYED OVER HERO IMAGE
       ------------------------------------------------------- */

    imageTitle: varchar(
      "image_title",
      {
        length: 255,
      }
    ).notNull(),

    imageSubtitle: varchar(
      "image_subtitle",
      {
        length: 255,
      }
    ).notNull(),

    imageBadge: varchar(
      "image_badge",
      {
        length: 120,
      }
    ).notNull(),

    /* -------------------------------------------------------
       FLOATING CHIP 1
       ------------------------------------------------------- */

    chip1Title: varchar(
      "chip_1_title",
      {
        length: 255,
      }
    ).notNull(),

    chip1Subtitle: varchar(
      "chip_1_subtitle",
      {
        length: 255,
      }
    ).notNull(),

    /* -------------------------------------------------------
       FLOATING CHIP 2
       ------------------------------------------------------- */

    chip2Title: varchar(
      "chip_2_title",
      {
        length: 255,
      }
    ).notNull(),

    chip2Subtitle: varchar(
      "chip_2_subtitle",
      {
        length: 255,
      }
    ).notNull(),

    /* -------------------------------------------------------
       FLOATING CHIP 3
       ------------------------------------------------------- */

    chip3Title: varchar(
      "chip_3_title",
      {
        length: 255,
      }
    ).notNull(),

    chip3Subtitle: varchar(
      "chip_3_subtitle",
      {
        length: 255,
      }
    ).notNull(),

    /* -------------------------------------------------------
       VISIBILITY
       ------------------------------------------------------- */

    isVisible: boolean(
      "is_visible"
    )
      .default(true)
      .notNull(),

    /* -------------------------------------------------------
       TIMESTAMPS
       ------------------------------------------------------- */

    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),
  }
);
/* =========================================================
   HOMEPAGE STATS
   ========================================================= */

export const homepageStats = pgTable(
  "homepage_stats",
  {
    id: serial("id")
      .primaryKey(),

    /*
     * Large number/value displayed on the website.
     *
     * Examples:
     * 12K+
     * 3.5K+
     * 48h
     * 24/7
     */
    value: varchar("value", {
      length: 100,
    }).notNull(),

    /*
     * Description shown below the value.
     *
     * Examples:
     * Gamers Equipped
     * Custom Builds
     */
    label: varchar("label", {
      length: 255,
    }).notNull(),

    /*
     * Allows hiding an individual stat
     * without deleting it.
     */
    isVisible: boolean(
      "is_visible"
    )
      .default(true)
      .notNull(),

    /*
     * Controls left-to-right display order.
     *
     * 0 = first
     * 1 = second
     * 2 = third
     */
    sortOrder: integer(
      "sort_order"
    )
      .default(0)
      .notNull(),

    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),
  }
);
/* =========================================================
   FEATURES SECTION SETTINGS
   ========================================================= */

export const featuresSettings = pgTable(
  "features_settings",
  {
    /*
     * We only need one row for the homepage
     * Features section.
     *
     * id = "main"
     */
    id: varchar("id", {
      length: 50,
    }).primaryKey(),

    /*
     * Small text above the main heading.
     *
     * Example:
     * Why Gamex
     */
    eyebrow: varchar("eyebrow", {
      length: 255,
    }).notNull(),

    /*
     * Main Features section heading.
     */
    title: varchar("title", {
      length: 255,
    }).notNull(),

    /*
     * Optional descriptive paragraph
     * underneath the heading.
     */
    subtitle: text(
      "subtitle"
    ).notNull(),

    /*
     * Hide/show the entire Features section.
     */
    isVisible: boolean(
      "is_visible"
    )
      .default(true)
      .notNull(),

    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),
  }
);

/* =========================================================
   HOMEPAGE FEATURE CARDS
   ========================================================= */

export const homepageFeatures = pgTable(
  "homepage_features",
  {
    id: serial("id")
      .primaryKey(),

    /*
     * Icon identifier.
     *
     * Examples currently used:
     *
     * wrench
     * shield
     * gauge
     * badge
     * zap
     * refresh
     */
    icon: varchar("icon", {
      length: 100,
    }).notNull(),

    /*
     * Feature card heading.
     */
    title: varchar("title", {
      length: 255,
    }).notNull(),

    /*
     * Feature card description.
     */
    description: text(
      "description"
    ).notNull(),

    /*
     * Hide/show this individual card.
     */
    isVisible: boolean(
      "is_visible"
    )
      .default(true)
      .notNull(),

    /*
     * Card display order.
     *
     * 0 = first
     * 1 = second
     * etc.
     */
    sortOrder: integer(
      "sort_order"
    )
      .default(0)
      .notNull(),

    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),
  }
);
/* =========================================================
   CONTACT SECTION SETTINGS
   ========================================================= */

export const contactSettings = pgTable(
  "contact_settings",
  {
    /*
     * One homepage Contact section.
     *
     * id = "main"
     */
    id: varchar("id", {
      length: 50,
    }).primaryKey(),

    /* =====================================================
       SECTION HEADING
       ===================================================== */

    eyebrow: varchar("eyebrow", {
      length: 255,
    }).notNull(),

    title: varchar("title", {
      length: 255,
    }).notNull(),

    subtitle: text(
      "subtitle"
    ).notNull(),

    /* =====================================================
       CONTACT INFORMATION
       ===================================================== */

    emailLabel: varchar(
      "email_label",
      {
        length: 100,
      }
    ).notNull(),

    email: varchar("email", {
      length: 255,
    }).notNull(),

    phoneLabel: varchar(
      "phone_label",
      {
        length: 100,
      }
    ).notNull(),

    phone: varchar("phone", {
      length: 100,
    }).notNull(),

    addressLabel: varchar(
      "address_label",
      {
        length: 100,
      }
    ).notNull(),

    address: text(
      "address"
    ).notNull(),

    hoursLabel: varchar(
      "hours_label",
      {
        length: 100,
      }
    ).notNull(),

    hours: varchar("hours", {
      length: 255,
    }).notNull(),

    /* =====================================================
       SOCIAL MEDIA
       ===================================================== */

    socialHeading: varchar(
      "social_heading",
      {
        length: 255,
      }
    ).notNull(),

    xUrl: varchar("x_url", {
      length: 1000,
    })
      .default("")
      .notNull(),

    instagramUrl: varchar(
      "instagram_url",
      {
        length: 1000,
      }
    )
      .default("")
      .notNull(),

    youtubeUrl: varchar(
      "youtube_url",
      {
        length: 1000,
      }
    )
      .default("")
      .notNull(),

    twitchUrl: varchar(
      "twitch_url",
      {
        length: 1000,
      }
    )
      .default("")
      .notNull(),

    /* =====================================================
       CONTACT FORM TEXT
       ===================================================== */

    nameLabel: varchar(
      "name_label",
      {
        length: 100,
      }
    ).notNull(),

    namePlaceholder: varchar(
      "name_placeholder",
      {
        length: 255,
      }
    ).notNull(),

    formEmailLabel: varchar(
      "form_email_label",
      {
        length: 100,
      }
    ).notNull(),

    formEmailPlaceholder: varchar(
      "form_email_placeholder",
      {
        length: 255,
      }
    ).notNull(),

    subjectLabel: varchar(
      "subject_label",
      {
        length: 100,
      }
    ).notNull(),

    subjectPlaceholder: varchar(
      "subject_placeholder",
      {
        length: 500,
      }
    ).notNull(),

    messageLabel: varchar(
      "message_label",
      {
        length: 100,
      }
    ).notNull(),

    messagePlaceholder: text(
      "message_placeholder"
    ).notNull(),

    submitButtonText: varchar(
      "submit_button_text",
      {
        length: 120,
      }
    ).notNull(),

    /* =====================================================
       VISIBILITY
       ===================================================== */

    isVisible: boolean(
      "is_visible"
    )
      .default(true)
      .notNull(),

    /* =====================================================
       TIMESTAMPS
       ===================================================== */

    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),
  }
);
/* =========================================================
   CONTACT SOCIAL LINKS
   ========================================================= */

export const contactSocialLinks = pgTable(
  "contact_social_links",
  {
    /*
     * Auto-generated database ID.
     */
    id: serial("id")
      .primaryKey(),

    /*
     * Platform identifier.
     *
     * Examples:
     *
     * instagram
     * tiktok
     * facebook
     * youtube
     * x
     * twitch
     * discord
     * whatsapp
     * linkedin
     */
    platform: varchar(
      "platform",
      {
        length: 50,
      }
    ).notNull(),

    /*
     * Public profile/page URL.
     */
    url: varchar("url", {
      length: 1000,
    }).notNull(),

    /*
     * Allows Admin to hide a social link
     * without permanently deleting it.
     */
    isVisible: boolean(
      "is_visible"
    )
      .default(true)
      .notNull(),

    /*
     * Controls the display order.
     *
     * 0 appears before 1,
     * 1 before 2, etc.
     */
    sortOrder: integer(
      "sort_order"
    )
      .default(0)
      .notNull(),

    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),
  }
);