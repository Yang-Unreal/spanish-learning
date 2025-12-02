import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { updateVocabularyDataSource } from "./src/utils/updateVocabularySource";
import { uploadImageAndUpdateDB } from "./src/utils/uploadImageToMinIO";

// Load environment variables
dotenv.config();

/**
 * Script to upload all images from public/image/ to MinIO and update the database and source file.
 *
 * Usage:
 * 1. Place your images in public/image/ folder
 * 2. Run: bun run upload-image.ts
 */

async function main() {
	try {
		const imagesDir = path.join(process.cwd(), "public", "image");

		if (!fs.existsSync(imagesDir)) {
			throw new Error(`Directory not found: ${imagesDir}`);
		}

		const files = fs.readdirSync(imagesDir);
		const imageFiles = files.filter((file) =>
			/\.(webp|jpg|jpeg|png|gif|svg)$/i.test(file),
		);

		console.log(`Found ${imageFiles.length} images to process.`);

		console.log("Environment variables:");
		console.log("- S3_ENDPOINT:", process.env.S3_ENDPOINT);
		console.log("- S3_BUCKET:", process.env.S3_BUCKET);
		console.log(
			"- DATABASE_URL:",
			process.env.DATABASE_URL ? "✓ Set" : "✗ Not set",
		);

		let successCount = 0;
		let failCount = 0;

		for (const imageName of imageFiles) {
			const wordName = path.parse(imageName).name; // "hola.webp" -> "hola"

			console.log(`\n----------------------------------------`);
			console.log(`Processing: ${imageName} (Word: ${wordName})`);

			try {
				// 1. Upload to MinIO and update Database
				const url = await uploadImageAndUpdateDB({
					imageName,
					wordName,
				});

				// 2. Update source file
				const sourceUpdated = await updateVocabularyDataSource(wordName, url);

				if (sourceUpdated) {
					console.log(`✓ Source file updated for '${wordName}'`);
				} else {
					console.warn(`⚠️ Could not update source file for '${wordName}'`);
				}

				successCount++;
			} catch (err) {
				console.error(`❌ Failed to process ${imageName}:`, err);
				failCount++;
			}
		}

		console.log("\n========================================");
		console.log(`🎉 Operation completed!`);
		console.log(`✅ Successful: ${successCount}`);
		console.log(`❌ Failed: ${failCount}`);
		console.log("========================================");

		process.exit(failCount > 0 ? 1 : 0);
	} catch (error) {
		console.error("\n❌ Fatal error:");
		if (error instanceof Error) {
			console.error("Error name:", error.name);
			console.error("Error message:", error.message);
			console.error("Error stack:", error.stack);
		} else {
			console.error("Error:", error);
		}
		process.exit(1);
	}
}

main();
