CREATE TABLE "advent_days" (
	"id" serial PRIMARY KEY NOT NULL,
	"day" integer NOT NULL,
	"message" text NOT NULL,
	"clue" text NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "advent_days_day_unique" UNIQUE("day")
);
--> statement-breakpoint
CREATE TABLE "email_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"day_id" text NOT NULL,
	"recipient_email" text NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"status" text NOT NULL,
	"qr_code_url" text NOT NULL,
	"error_message" text
);
