import fs from 'fs';
import path from 'path';

const vocabularyDataPath = path.resolve('./src/vocabularyData.ts');

async function enrichData() {
  try {
    const fileContent = fs.readFileSync(vocabularyDataPath, 'utf-8');
    // Extract the array from the file content
    const arrayMatch = fileContent.match(/export const vocabularyData: VocabularyItem\[\] = (\[[\s\S]*?\]);/);
    if (!arrayMatch) {
      throw new Error('Could not parse vocabularyData from file');
    }
    const vocabularyData = JSON.parse(arrayMatch[1]);

    const wordsToEnrich = vocabularyData.slice(10).filter(item => item.word.length > 3);

    const batchSize = 50;
    for (let i = 0; i < wordsToEnrich.length; i += batchSize) {
      const batch = wordsToEnrich.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(wordsToEnrich.length / batchSize)}`);

      for (const item of batch) {
        try {
          const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/es/${item.word}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          if (!response.ok) {
            console.error(`Failed to fetch data for ${item.word}`);
            continue;
          }
          const data = await response.json();
          const entry = data[0];

          if (entry) {
            item.ipa = entry.phonetic || '';
            if (entry.meanings && entry.meanings[0] && entry.meanings[0].definitions[0]) {
              item.example = entry.meanings[0].definitions[0].example || '';
              // For simplicity, exampleTranslation will be the same as example.
              // A proper translation service would be needed for accurate translations.
              item.exampleTranslation = entry.meanings[0].definitions[0].example || '';
            }
          }
        } catch (error) {
          console.error(`Error processing ${item.word}:`, error);
        }
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const newVocabularyDataContent = `
export interface VocabularyItem {
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

    fs.writeFileSync(vocabularyDataPath, newVocabularyDataContent.trim());
    console.log('Successfully enriched vocabularyData.ts');
  } catch (error) {
    console.error('Error enriching data:', error);
  }
}

enrichData();