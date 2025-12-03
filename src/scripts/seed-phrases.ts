import { db } from "../db";
import { phrases } from "../db/schema";
import { phrasesData } from "../phrasesData";

async function seedPhrases() {
  console.log("🌱 Seeding phrases...");

  try {
    // Optional: Clear existing phrases if you want a fresh start
    // await db.delete(phrases);

    for (const phrase of phrasesData) {
      await db.insert(phrases).values({
        word: phrase.word,
        translation: phrase.translation,
        image: phrase.image,
        ipa: phrase.ipa,
        example: phrase.example,
        exampleTranslation: phrase.exampleTranslation,
        level: phrase.level || "Basic",
      });
    }

    console.log("✅ Phrases seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding phrases:", error);
  } finally {
    process.exit(0);
  }
}

seedPhrases();
