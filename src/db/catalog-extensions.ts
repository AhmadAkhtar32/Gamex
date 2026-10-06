import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
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
    id: serial("id")
      .primaryKey(),

    categoryId: integer(
      "category_id"
    )
      .notNull()
      .references(
        () =>
          catalogCategories.id,
        {
          onDelete:
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
    ).notNull(),

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
  },

  (table) => [
    uniqueIndex(
      "catalog_subcategories_category_slug_uq"
    ).on(
      table.categoryId,
      table.slug
    ),
  ]
);

/* =========================================================
   PRODUCT SUBCATEGORY ASSIGNMENT

   products.category remains the MAIN category.

   Example:

   products.category = accessories

   assignment:
   accessories -> cooling-fans
   ========================================================= */

export const productSubcategoryAssignments =
  pgTable(
    "product_subcategory_assignments",
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
          }
        ),

      subcategoryId: integer(
        "subcategory_id"
      )
        .notNull()
        .references(
          () =>
            catalogSubcategories.id,
          {
            onDelete:
              "cascade",
          }
        ),

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
   PC BUILDER CATEGORY SETTINGS

   IMPORTANT:

   This does NOT create another category system.

   It only stores settings for an existing
   catalog_categories row.

   Therefore:

   Admin Category -> Products -> Build Your Rig

   all use the SAME category.
   ========================================================= */

export const pcBuilderCategorySettings =
  pgTable(
    "pc_builder_category_settings",
    {
      id: serial(
        "id"
      ).primaryKey(),

      catalogCategoryId: integer(
        "catalog_category_id"
      )
        .notNull()
        .references(
          () =>
            catalogCategories.id,
          {
            onDelete:
              "cascade",
          }
        )
        .unique(),

      description: text(
        "description"
      )
        .default("")
        .notNull(),

      helpText: varchar(
        "help_text",
        {
          length: 500,
        }
      )
        .default("")
        .notNull(),

      isRequired: boolean(
        "is_required"
      )
        .default(false)
        .notNull(),

      isVisible: boolean(
        "is_visible"
      )
        .default(true)
        .notNull(),

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