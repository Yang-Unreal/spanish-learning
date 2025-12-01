import fs from "fs";
import { type VocabularyItem, vocabularyData } from "./src/vocabularyData";

const categoryMapping: Record<string, VocabularyItem["category"]> = {
	// Grammar
	cuando: "Grammar",
	también: "Grammar",
	mucho: "Grammar",
	mucha: "Grammar",
	muchos: "Grammar",
	ningún: "Grammar",
	toda: "Grammar",
	todas: "Grammar",
	primera: "Grammar",

	// Adjectives
	gran: "Adjectives",
	general: "Adjectives",
	importante: "Adjectives",
	largo: "Adjectives",
	diferentes: "Adjectives",
	naranja: "Adjectives",
	rosa: "Adjectives",
	marrón: "Adjectives",

	// Time & Numbers
	millones: "Time & Numbers",
	final: "Time & Numbers",
	pasado: "Time & Numbers",
	futuro: "Time & Numbers",

	// Society
	españa: "Society",
	sociedad: "Society",
	obra: "Society",
	cine: "Society",
	parque: "Society",
	plaza: "Society",
	piscina: "Society",
	gimnasio: "Society",
	deporte: "Society",
	fútbol: "Society",
	baloncesto: "Society",
	tenis: "Society",
	golf: "Society",

	// Verbs
	fueron: "Verbs",
	será: "Verbs",
	levantarse: "Verbs",
	bañarse: "Verbs",
	vestirse: "Verbs",
	peinarse: "Verbs",
	reír: "Verbs",
	sonreír: "Verbs",

	// People
	nuestra: "People",

	// Common Nouns
	juego: "Common Nouns",
	ordenador: "Common Nouns",

	// Abstract
	relaciones: "Abstract",

	// Nature
	nieve: "Nature",
	lluvia: "Nature",
	viento: "Nature",
	nube: "Nature",
	playa: "Nature",

	// Food
	queso: "Food",
	leche: "Food",
	café: "Food",
	té: "Food",
	vino: "Food",
	cerveza: "Food",

	// Travel
	fiesta: "Travel",
	vacaciones: "Travel",
	viaje: "Travel",
	taxi: "Travel",
	hotel: "Travel",
	restaurante: "Travel",
};

let updatedCount = 0;
const unknownWords: string[] = [];

const updatedData = vocabularyData.map((item) => {
	if (item.category === "General") {
		const lowerWord = item.word.toLowerCase();
		const newCategory = categoryMapping[lowerWord];
		if (newCategory) {
			updatedCount++;
			return { ...item, category: newCategory };
		} else {
			unknownWords.push(item.word);
			// Default fallback if still not found?
			// Let's map remaining to 'Abstract' or 'Common Nouns' if we have to,
			// but ideally we catch them all.
			return item;
		}
	}
	return item;
});

console.log(`Updated ${updatedCount} items.`);
console.log("Remaining unknown words:", JSON.stringify(unknownWords, null, 2));

const content = `export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  category: 'Greetings' | 'Food' | 'Travel' | 'Family' | 'Nature' | 'General' | 'Grammar' | 'Verbs' | 'Common Nouns' | 'Time & Numbers' | 'People' | 'Society' | 'Abstract' | 'Adjectives';
  image: string;
  ipa: string;
  example: string;
  exampleTranslation: string;
  gender?: 'Masculine' | 'Feminine';
}

export const vocabularyData: VocabularyItem[] = ${JSON.stringify(updatedData, null, 2)};
`;

fs.writeFileSync("./src/vocabularyData.ts", content);
