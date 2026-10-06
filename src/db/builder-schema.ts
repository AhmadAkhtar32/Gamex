import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import {
  catalogCategories,
  products,
} from "./schema";

/* =========================================================
   CATALOG SUBCATEGORIES
   ========================================================= */

export const catalogSubcategories = pgTable(
  "catalog_subcategories",
  {
    id: serial("id").primaryKey(),

    categorySlug: varchar(
      "category_slug",
      {
        length: 120,
      }
    )
      .notNull()
      .references(
        () =>
          catalogCategories.slug,
        {
          onDelete:
            "cascade",

          onUpdate:
            "cascade",
        }
      ),

    name: varchar(
      "name",
      {
        length: 120,
      }
    ).notNull(),

    slug: varchar(
      "slug",
      {
        length: 120,
      }
    )
      .notNull()
      .unique(),

    sortOrder: integer(
      "sort_order"
    )
      .default(0)
      .notNull(),

    isVisible: boolean(
      "is_visible"
    )
      .default(true)
      .notNull(),

    createdAt: timestamp(
      "created_at",
      {
        withTimezone:
          true,
      }
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone:
          true,
      }
    )
      .defaultNow()
      .notNull(),
  }
);

/* =========================================================
   PRODUCT SUBCATEGORY

   Each product can have zero or one subcategory.

   Main category stays in:
   products.category

   Subcategory is stored here.
   ========================================================= */

export const productSubcategories = pgTable(
  "product_subcategories",
  {
    productId: varchar(
      "product_id",
      {
        length: 100,
      }
    )
      .primaryKey()
      .references(
        () =>
          products.id,
        {
          onDelete:
            "cascade",

          onUpdate:
            "cascade",
        }
      ),

    subcategorySlug: varchar(
      "subcategory_slug",
      {
        length: 120,
      }
    )
      .notNull()
      .references(
        () =>
          catalogSubcategories.slug,
        {
          onDelete:
            "cascade",

          onUpdate:
            "cascade",
        }
      ),

    createdAt: timestamp(
      "created_at",
      {
        withTimezone:
          true,
      }
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone:
          true,
      }
    )
      .defaultNow()
      .notNull(),
  }
);

/* =========================================================
   BUILD YOUR RIG CATEGORY SETTINGS

   IMPORTANT:

   Categories themselves come from catalog_categories.

   This table stores ONLY Builder-specific options such as:
   - Show/hide in Builder
   - Required/optional
   - Help text

   Therefore there is no second category system anymore.
   ========================================================= */

export const builderCategorySettings = pgTable(
  "builder_category_settings",
  {
    categorySlug: varchar(
      "category_slug",
      {
        length: 120,
      }
    )
      .primaryKey()
      .references(
        () =>
          catalogCategories.slug,
        {
          onDelete:
            "cascade",

          onUpdate:
            "cascade",
        }
      ),

    isVisible: boolean(
      "is_visible"
    )
      .default(true)
      .notNull(),

    isRequired: boolean(
      "is_required"
    )
      .default(false)
      .notNull(),

    helpText: varchar(
      "help_text",
      {
        length: 500,
      }
    )
      .default("")
      .notNull(),

    createdAt: timestamp(
      "created_at",
      {
        withTimezone:
          true,
      }
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone:
          true,
      }
    )
      .defaultNow()
      .notNull(),
  }
);