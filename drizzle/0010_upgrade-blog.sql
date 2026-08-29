CREATE TABLE "blog_settings" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"eyebrow" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"accent" varchar(120) DEFAULT '' NOT NULL,
	"subtitle" text NOT NULL,
	"read_more_text" varchar(100) DEFAULT 'Read Story' NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog_posts" ALTER COLUMN "image" SET DATA TYPE varchar(1000);--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "content" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "is_visible" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;