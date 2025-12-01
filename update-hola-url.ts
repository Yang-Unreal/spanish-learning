import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { db } from "./src/db/index";
import { words } from "./src/db/schema";

interface PostgresError extends Error {
  code?: string;
  detail?: string;
}

// Load environment variables
dotenv.config();

async function updateHolaImage() {
	try {
		console.log(
			"DATABASE_URL:",
			process.env.DATABASE_URL ? "✓ Set" : "✗ Not set",
		);

		const minioUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/images/hola.webp`;

		console.log("Updating 'Hola' word image URL...");
		console.log("New URL:", minioUrl);

		// Update the word 'Hola' with the new MinIO URL
		const result = await db
			.update(words)
			.set({ image: minioUrl })
			.where(eq(words.word, "Hola"))
			.returning();

		if (result.length > 0) {
			console.log("\n✅ Successfully updated!");
			console.log("Updated word:", result[0].word);
			console.log("New image URL:", result[0].image);
		} else {
			console.log("\n⚠️ No word 'Hola' found in database");
		}

		process.exit(0);
	} catch (error) {
		console.error("\n❌ Update failed:");
		console.error("Full error object:", error);
		if (error instanceof Error) {
			console.error("Error message:", error.message);
			console.error("Error name:", error.name);
			console.error("Stack:", error.stack);
			// Check for postgres-specific error details
			if ((error as PostgresError).code) {
				console.error("Postgres error code:", (error as PostgresError).code);
			}
			if ((error as PostgresError).detail) {
				console.error("Postgres error detail:", (error as PostgresError).detail);
			}
		}
		process.exit(1);
	}
}

updateHolaImage();
