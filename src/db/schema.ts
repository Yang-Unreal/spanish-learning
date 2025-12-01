import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const levelEnum = pgEnum("level", ["Basic", "Intermediate", "Advanced"]);
export const categoryEnum = pgEnum("category", [
	"Greetings",
	"Food",
	"Travel",
	"Family",
	"Nature",
	"General",
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
