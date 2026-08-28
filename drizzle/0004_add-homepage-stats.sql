CREATE TABLE "homepage_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" varchar(100) NOT NULL,
	"label" varchar(255) NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
