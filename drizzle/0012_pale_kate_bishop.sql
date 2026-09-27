CREATE TABLE "hero_media" (
	"id" serial PRIMARY KEY NOT NULL,
	"media_type" varchar(20) NOT NULL,
	"url" varchar(2000) NOT NULL,
	"alt" varchar(500) DEFAULT '' NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
