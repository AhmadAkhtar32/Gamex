CREATE TABLE "catalog_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"applies_to" varchar(20) DEFAULT 'product' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "catalog_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "custom_builds" ADD COLUMN "category" varchar(120) DEFAULT 'custom-pcs' NOT NULL;