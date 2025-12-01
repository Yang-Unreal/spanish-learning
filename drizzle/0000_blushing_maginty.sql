CREATE TYPE "public"."category" AS ENUM('Greetings', 'Food', 'Travel', 'Family', 'Nature', 'General');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('Masculine', 'Feminine');--> statement-breakpoint
CREATE TYPE "public"."level" AS ENUM('Basic', 'Intermediate', 'Advanced');--> statement-breakpoint
CREATE TABLE "words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word" text NOT NULL,
	"translation" text NOT NULL,
	"level" "level" NOT NULL,
	"category" "category" NOT NULL,
	"image" text NOT NULL,
	"ipa" text NOT NULL,
	"example" text NOT NULL,
	"example_translation" text NOT NULL,
	"gender" "gender"
);
