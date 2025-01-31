CREATE TYPE "public"."artwork_status" AS ENUM('available', 'sold', 'reserved', 'not_for_sale');--> statement-breakpoint
CREATE TYPE "public"."list_type" AS ENUM('contact_favorite', 'website_collection', 'series', 'curated_show', 'internal');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" timestamp,
	"token_type" text,
	"scope" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artwork_list_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artwork_list_id" uuid NOT NULL,
	"artwork_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artwork_lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"list_type" "list_type" NOT NULL,
	"reference_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artwork_materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artwork_id" uuid NOT NULL,
	"material_id" uuid NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artwork_production_costs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"total_cost" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artwork_secondary_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artwork_id" uuid NOT NULL,
	"image_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artworks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"artist_id" varchar(128) NOT NULL,
	"year" integer,
	"medium" text,
	"dimensions" text,
	"description" text,
	"series_id" uuid,
	"edition_number" integer,
	"edition_total" integer,
	"provenance_id" uuid,
	"production_cost_id" uuid,
	"retail_price" numeric(10, 2),
	"status" "artwork_status" DEFAULT 'available' NOT NULL,
	"location" text,
	"main_image_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"alt" text,
	"caption" text,
	"width" integer,
	"height" integer,
	"size" integer,
	"mime_type" text,
	"filename" text,
	"blur_data_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"unit_measurement" text NOT NULL,
	"supplier" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provenance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"previous_owner" text,
	"acquisition_method" text,
	"date_acquired" timestamp,
	"sale_price" numeric(10, 2),
	"exhibition_history" text[],
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "series" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text,
	"emailVerified" timestamp,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "artwork_list_items" ADD CONSTRAINT "artwork_list_items_artwork_list_id_artwork_lists_id_fk" FOREIGN KEY ("artwork_list_id") REFERENCES "public"."artwork_lists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artwork_list_items" ADD CONSTRAINT "artwork_list_items_artwork_id_artworks_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artwork_materials" ADD CONSTRAINT "artwork_materials_artwork_id_artworks_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artwork_materials" ADD CONSTRAINT "artwork_materials_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artwork_secondary_images" ADD CONSTRAINT "artwork_secondary_images_artwork_id_artworks_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artwork_secondary_images" ADD CONSTRAINT "artwork_secondary_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_artist_id_users_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_provenance_id_provenance_id_fk" FOREIGN KEY ("provenance_id") REFERENCES "public"."provenance"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_production_cost_id_artwork_production_costs_id_fk" FOREIGN KEY ("production_cost_id") REFERENCES "public"."artwork_production_costs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_main_image_id_images_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."images"("id") ON DELETE no action ON UPDATE no action;