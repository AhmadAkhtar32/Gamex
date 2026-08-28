CREATE TABLE "features_settings" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"eyebrow" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"subtitle" text NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "homepage_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"icon" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
