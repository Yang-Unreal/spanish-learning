import fs from 'fs';
import { vocabularyData } from './src/vocabularyData.ts';

function generateIPA(word: string): string {
  // Simple approximation: wrap in / /
  return `/${word}/`;
}

function generateExample(word: string): string {
  return `El ${word} es importante.`;
}

function generateExampleTranslation(word: string): string {
  return `The ${word} is important.`;
}

function generateImage(translation: string): string {
  // Use Loremflickr for relevant images based on translation
  return `https://loremflickr.com/800/600/${encodeURIComponent(translation)}`;
}

for (let i = 10; i < vocabularyData.length; i++) { // id 11 is index 10
  const item = vocabularyData[i];
  if (!item.ipa) {
    item.ipa = generateIPA(item.word);
  }
  if (!item.example) {
    item.example = generateExample(item.word);
  }
  if (!item.exampleTranslation) {
    item.exampleTranslation = generateExampleTranslation(item.word);
  }
  if (!item.image || item.image.includes('picsum.photos')) {
    item.image = generateImage(item.translation);
  }
}

// Write back to file
const content = `export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  category: 'Greetings' | 'Food' | 'Travel' | 'Family' | 'Nature' | 'General';
  image: string;
  ipa: string;
  example: string;
  exampleTranslation: string;
  gender?: 'Masculine' | 'Feminine';
}

export const vocabularyData: VocabularyItem[] = ${JSON.stringify(vocabularyData, null, 2)};
`;

fs.writeFileSync('./src/vocabularyData.ts', content);
console.log('Data filled successfully.');