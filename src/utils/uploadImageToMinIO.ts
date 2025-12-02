import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { db } from "../db/index";
import { words } from "../db/schema";

interface UploadConfig {
	imageName: string; // e.g., "hola.webp", "gracias.webp"
	wordName: string; // The Spanish word to update in database, e.g., "Hola", "Gracias"
	localImagePath?: string; // Optional: custom local path, defaults to public/image/{imageName}
	s3Key?: string; // Optional: custom S3 key, defaults to images/{imageName}
}

/**
 * Universal function to upload an image to MinIO and update the database
 * @param config - Configuration object with imageName and wordName
 * @returns Promise with the uploaded URL
 */
export async function uploadImageAndUpdateDB(
	config: UploadConfig,
): Promise<string> {
	const { imageName, wordName, localImagePath, s3Key } = config;

	// Validate environment variables
	if (!process.env.S3_ENDPOINT) {
		throw new Error("S3_ENDPOINT is not set in environment variables");
	}
	if (!process.env.S3_BUCKET) {
		throw new Error("S3_BUCKET is not set in environment variables");
	}
	if (!process.env.S3_ACCESS_KEY_ID) {
		throw new Error("S3_ACCESS_KEY_ID is not set in environment variables");
	}
	if (!process.env.S3_SECRET_ACCESS_KEY) {
		throw new Error(
			"S3_SECRET_ACCESS_KEY is not set in environment variables",
		);
	}

	// Configure S3 client for MinIO
	const s3Client = new S3Client({
		endpoint: process.env.S3_ENDPOINT,
		region: process.env.S3_REGION || "us-east-1",
		credentials: {
			accessKeyId: process.env.S3_ACCESS_KEY_ID,
			secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
		},
		forcePathStyle: true, // Required for MinIO
	});

	// Set default paths
	const imagePath =
		localImagePath || path.join(process.cwd(), "public", "image", imageName);
	const bucketName = process.env.S3_BUCKET;
	const key = s3Key || `images/${imageName}`;

	console.log("\n=== Upload Configuration ===");
	console.log("Image name:", imageName);
	console.log("Word to update:", wordName);
	console.log("Local image path:", imagePath);
	console.log("Bucket:", bucketName);
	console.log("S3 Key:", key);

	// Check if file exists
	if (!fs.existsSync(imagePath)) {
		throw new Error(`File not found: ${imagePath}`);
	}

	// Read the file
	const fileContent = fs.readFileSync(imagePath);
	console.log(`\n✓ File read successfully (${fileContent.length} bytes)`);

	// Determine content type based on file extension
	const ext = path.extname(imageName).toLowerCase();
	const contentTypeMap: Record<string, string> = {
		".webp": "image/webp",
		".jpg": "image/jpeg",
		".jpeg": "image/jpeg",
		".png": "image/png",
		".gif": "image/gif",
		".svg": "image/svg+xml",
	};
	const contentType = contentTypeMap[ext] || "application/octet-stream";

	// Upload to MinIO
	const command = new PutObjectCommand({
		Bucket: bucketName,
		Key: key,
		Body: fileContent,
		ContentType: contentType,
	});

	console.log(`\nUploading ${imagePath} to ${bucketName}/${key}...`);
	const response = await s3Client.send(command);

	console.log("\n✅ Upload to MinIO successful!");
	console.log("Response ETag:", response.ETag);

	// Construct the MinIO URL
	const minioUrl = `${process.env.S3_ENDPOINT}/${bucketName}/${key}`;
	console.log("File URL:", minioUrl);

	// Update the database
	console.log(`\nUpdating '${wordName}' word image URL in database...`);
	const result = await db
		.update(words)
		.set({ image: minioUrl })
		.where(eq(words.word, wordName))
		.returning();

	if (result.length > 0) {
		console.log("\n✅ Database update successful!");
		console.log("Updated word:", result[0].word);
		console.log("New image URL:", result[0].image);
	} else {
		console.log(`\n⚠️ No word '${wordName}' found in database`);
		console.log("Image was uploaded to MinIO but database was not updated.");
	}

	return minioUrl;
}
