import {
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

export const contactMessages = pgTable("contact_messages", {
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
});


/* =========================================================
   BLOG POSTS
   ========================================================= */

export const blogPosts = pgTable("blog_posts", {
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
});


/* =========================================================
   ADMINS
   ========================================================= */

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),

  name: varchar("name", {
    length: 255,
  }).notNull(),

  email: varchar("email", {
    length: 255,
  })
    .notNull()
    .unique(),

  passwordHash: text("password_hash").notNull(),

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
});


/* =========================================================
   ADMIN SESSIONS
   ========================================================= */

export const adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),

  /*
   * Which administrator owns this login session?
   *
   * Example:
   * adminId = 1
   *
   * means this session belongs to the admin whose
   * admins.id is 1.
   */
  adminId: integer("admin_id")
    .notNull()
    .references(() => admins.id, {
      onDelete: "cascade",
    }),

  /*
   * We will NEVER store the actual session token here.
   *
   * The browser receives a random secret token.
   * We hash that token before storing it in PostgreSQL.
   *
   * SHA-256 produces 64 hexadecimal characters,
   * therefore length 64 is enough.
   */
  tokenHash: varchar("token_hash", {
    length: 64,
  })
    .notNull()
    .unique(),

  /*
   * The session stops working after this date/time.
   *
   * We will initially use a 7-day login session.
   */
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
  }).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});