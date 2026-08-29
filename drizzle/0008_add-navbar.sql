CREATE TABLE "navbar_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar(120) NOT NULL,
	"href" varchar(500) NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "navbar_settings" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"brand_text" varchar(120) NOT NULL,
	"brand_href" varchar(500) DEFAULT '#home' NOT NULL,
	"logo_image" varchar(1000) DEFAULT '' NOT NULL,
	"logo_alt" varchar(255) DEFAULT 'Gamex' NOT NULL,
	"cta_text" varchar(120) NOT NULL,
	"cta_href" varchar(500) NOT NULL,
	"cta_visible" boolean DEFAULT true NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
