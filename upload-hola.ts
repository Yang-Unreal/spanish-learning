import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();

console.log("Environment variables loaded:");
console.log("- S3_ENDPOINT:", process.env.S3_ENDPOINT);
console.log("- S3_REGION:", process.env.S3_REGION);
console.log("- S3_BUCKET:", process.env.S3_BUCKET);
console.log(
	"- S3_ACCESS_KEY_ID:",
	process.env.S3_ACCESS_KEY_ID ? "✓ Set" : "✗ Not set",
);
console.log(
	"- S3_SECRET_ACCESS_KEY:",
	process.env.S3_SECRET_ACCESS_KEY ? "✓ Set" : "✗ Not set",
);

// Validate required environment variables
if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
	console.error("\n❌ Missing required environment variables:");
	console.error(
		"Please set S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY in your .env file",
	);
	process.exit(1);
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

async function uploadImage() {
	try {
		const imagePath = path.join(process.cwd(), "public", "image", "hola.webp");
		const bucketName = process.env.S3_BUCKET || "spanish";
		const key = "images/hola.webp"; // S3 key (path in bucket)

		console.log("\n=== Upload Configuration ===");
		console.log("Image path:", imagePath);
		console.log("Bucket:", bucketName);
		console.log("Key:", key);

		// Check if file exists
		if (!fs.existsSync(imagePath)) {
			console.error(`\n❌ File not found: ${imagePath}`);
			process.exit(1);
		}

		// Read the file
		const fileContent = fs.readFileSync(imagePath);
		console.log(`\n✓ File read successfully (${fileContent.length} bytes)`);

		// Upload to MinIO
		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: key,
			Body: fileContent,
			ContentType: "image/webp",
		});

		console.log(`\nUploading ${imagePath} to ${bucketName}/${key}...`);
		const response = await s3Client.send(command);

		console.log("\n✅ Upload successful!");
		console.log(`File URL: ${process.env.S3_ENDPOINT}/${bucketName}/${key}`);
		console.log("Response ETag:", response.ETag);

		process.exit(0);
	} catch (error) {
		console.error("\n❌ Upload failed:");
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

uploadImage();
