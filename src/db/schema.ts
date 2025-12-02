import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const levelEnum = pgEnum("level", ["Basic", "Intermediate", "Advanced"]);
export const categoryEnum = pgEnum("category", [
	// Phase 1: The Essentials
	"Greetings & Social Courtesies",
	"Pronouns",
	"Question Words",
	"Connectors",
	"Numbers & Quantifiers",
	"Time & Calendar",
	// Phase 2: Me and My Life
	"The Body & Health",
	"Family & Relationships",
	"Home & Furniture",
	"Clothing & Accessories",
	"Daily Routine",
	// Phase 3: Food & Dining
	"Ingredients",
	"Drinks",
	"Tastes & Textures",
	"At the Restaurant",
	// Phase 4: Out & About
	"Transportation",
	"City & Places",
	"Directions & Location",
	"Nature & Weather",
	"Animals",
	// Phase 5: Society, Work, & Abstract
	"Professions",
	"School & Study",
	"Technology & Media",
	"Emotions & Personality",
	"Descriptive Adjectives",
	// Extras
	"Verbs",
	"Abstract",
]);
export const genderEnum = pgEnum("gender", ["Masculine", "Feminine"]);

export const words = pgTable("words", {
	id: uuid("id").defaultRandom().primaryKey(),
	word: text("word").notNull(),
	translation: text("translation").notNull(),
	level: levelEnum("level").notNull(),
	category: categoryEnum("category").notNull(),
	image: text("image").notNull(),
	ipa: text("ipa").notNull(),
	example: text("example").notNull(),
	exampleTranslation: text("example_translation").notNull(),
	gender: genderEnum("gender"),
});

export type Word = typeof words.$inferSelect;
