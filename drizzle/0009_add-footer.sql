CREATE TABLE "footer_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar(120) NOT NULL,
	"href" varchar(500) NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "footer_settings" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"brand_text" varchar(120) NOT NULL,
	"brand_href" varchar(500) DEFAULT '#home' NOT NULL,
	"logo_image" varchar(1000) DEFAULT '' NOT NULL,
	"logo_alt" varchar(255) DEFAULT 'Gamex' NOT NULL,
	"description" text NOT NULL,
	"navigation_heading" varchar(120) NOT NULL,
	"contact_heading" varchar(120) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(120) NOT NULL,
	"address" text NOT NULL,
	"cta_text" varchar(120) NOT NULL,
	"cta_href" varchar(500) NOT NULL,
	"cta_visible" boolean DEFAULT true NOT NULL,
	"copyright_text" varchar(500) NOT NULL,
	"back_to_top_text" varchar(120) NOT NULL,
	"back_to_top_href" varchar(500) DEFAULT '#home' NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "footer_social_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" varchar(50) NOT NULL,
	"url" varchar(1000) NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
