import fs from "fs";
import { VocabularyItem, vocabularyData } from "./src/vocabularyData";

// Map Spanish numbers to their Arabic numerals
const numberMap: Record<string, string> = {
	cero: "0",
	uno: "1",
	dos: "2",
	tres: "3",
	cuatro: "4",
	cinco: "5",
	seis: "6",
	siete: "7",
	ocho: "8",
	nueve: "9",
	diez: "10",
	once: "11",
	doce: "12",
	trece: "13",
	catorce: "14",
	quince: "15",
	veinte: "20",
	treinta: "30",
	cuarenta: "40",
	cincuenta: "50",
	sesenta: "60",
	setenta: "70",
	ochenta: "80",
	noventa: "90",
	cien: "100",
	mil: "1000",
	millones: "1000000",
	millón: "1000000",
};

let updatedCount = 0;

const updatedData = vocabularyData.map((item) => {
	const arabicNumber = numberMap[item.word.toLowerCase()];

	if (arabicNumber) {
		updatedCount++;
		// Use a simple, clean image URL that displays the Arabic numeral
		return {
			...item,
			image: `https://image.pollinations.ai/prompt/large%20arabic%20numeral%20${arabicNumber}%20on%20white%20background%20simple%20clean%20typography?width=800&height=600&nologo=true`,
		};
	}

	return item;
});

console.log(`Updated ${updatedCount} number images.`);

const content = `export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  category: 'Greetings' | 'Food' | 'Travel' | 'Family' | 'Nature' | 'Grammar' | 'Verbs' | 'Common Nouns' | 'Time & Numbers' | 'People' | 'Society' | 'Abstract' | 'Adjectives';
  image: string;
  ipa: string;
  example: string;
  exampleTranslation: string;
  gender?: 'Masculine' | 'Feminine';
}

export const vocabularyData: VocabularyItem[] = ${JSON.stringify(updatedData, null, 2)};
`;

fs.writeFileSync("./src/vocabularyData.ts", content);
console.log("✅ Updated vocabularyData.ts");
