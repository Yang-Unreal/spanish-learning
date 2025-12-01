
import { vocabularyData } from './src/vocabularyData';

const generalWords = vocabularyData
  .filter(item => item.category === 'General')
  .map(item => item.word);

console.log(JSON.stringify(generalWords, null, 2));
