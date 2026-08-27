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