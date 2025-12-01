import fs from 'fs';
import { vocabularyData } from './src/vocabularyData.ts';

function generateIPA(word) {
  // Simple approximation: wrap in / /
  return `/${word}/`;
}

function generateExample(word) {
  return `El ${word} es importante.`;
}

function generateExampleTranslation(word) {
  return `The ${word} is important.`;
}

function generateImage(word) {
  // Generic Unsplash URL
  return `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80`;
}

for (let i = 20; i < vocabularyData.length; i++) { // id 21 is index 20
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
  if (!item.image) {
    item.image = generateImage(item.word);
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