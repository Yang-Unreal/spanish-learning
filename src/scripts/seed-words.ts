import { db } from '../db';
import { words } from '../db/schema';
import { vocabularyData } from '../vocabularyData';

async function seed() {
  console.log('Seeding words...');

  // Clear existing data
  await db.delete(words);
  console.log('Cleared existing words.');
  
  // Prepare data: remove id to let DB generate UUIDs
  const dataToInsert = vocabularyData.map(({ id, ...rest }) => rest);

  // Insert in batches to avoid issues with large data
  const batchSize = 100;
  for (let i = 0; i < dataToInsert.length; i += batchSize) {
    const batch = dataToInsert.slice(i, i + batchSize);
    await db.insert(words).values(batch);
    console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}`);
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
