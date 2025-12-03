import { cache } from "@solidjs/router";
import { and, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { phrases, words } from "../db/schema";

export const getWords = cache(async (page = 1, limit = 20, level?: string, category?: string) => {
  "use server";
  try {
    const offset = (page - 1) * limit;
    const filters = [];

    if (level) filters.push(eq(words.level, level as any));
    if (category && category !== "All") filters.push(eq(words.category, category as any));

    return await db
      .select()
      .from(words)
      .where(and(...filters))
      .limit(limit)
      .offset(offset);
  } catch (error) {
    console.error("Failed to fetch words:", error);
    return [];
  }
}, "words");

export const getPhrases = cache(async () => {
  "use server";
  try {
    return await db.select().from(phrases);
  } catch (error) {
    console.error("Failed to fetch phrases:", error);
    return [];
  }
}, "phrases");
