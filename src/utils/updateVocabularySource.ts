import fs from "fs";
import path from "path";

/**
 * Updates the image URL for a specific word in the vocabularyData.ts source file.
 * @param word - The word to update (case-insensitive match)
 * @param newUrl - The new image URL
 */
export async function updateVocabularyDataSource(
	word: string,
	newUrl: string,
): Promise<boolean> {
	const filePath = path.join(process.cwd(), "src", "vocabularyData.ts");

	if (!fs.existsSync(filePath)) {
		console.error(`❌ File not found: ${filePath}`);
		return false;
	}

	const content = fs.readFileSync(filePath, "utf-8");

	// Regex to find the object containing the word and its image field
	// This regex looks for:
	// 1. "word": "Word" (case insensitive)
	// 2. Any content until "image": "..."
	// It captures the image line to replace it

	// We need to be careful to match the specific word object.
	// Strategy: Find the block for the word, then replace the image field within that block.

	// Simplified approach:
	// 1. Find the index of `"word": "TargetWord"`
	// 2. From there, find the next `"image": "..."`
	// 3. Replace that specific instance

	const wordRegex = new RegExp(`"word":\\s*"${word}"`, "i");
	const match = content.match(wordRegex);

	if (!match || match.index === undefined) {
		console.warn(`⚠️ Word '${word}' not found in vocabularyData.ts`);
		return false;
	}

	const wordIndex = match.index;
	const contentAfterWord = content.slice(wordIndex);

	// Find the image field after the word
	const imageRegex = /"image":\s*"(.*?)"/;
	const imageMatch = contentAfterWord.match(imageRegex);

	if (!imageMatch || imageMatch.index === undefined) {
		console.warn(
			`⚠️ Image field not found for word '${word}' in vocabularyData.ts`,
		);
		return false;
	}

	// Calculate the absolute position of the image field
	const imageStartIndex = wordIndex + imageMatch.index;
	const imageEndIndex = imageStartIndex + imageMatch[0].length;

	// Construct the new content
	const newImageLine = `"image": "${newUrl}"`;
	const newContent =
		content.slice(0, imageStartIndex) +
		newImageLine +
		content.slice(imageEndIndex);

	fs.writeFileSync(filePath, newContent, "utf-8");
	console.log(`✅ Updated vocabularyData.ts for word '${word}'`);

	return true;
}
