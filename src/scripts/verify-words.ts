import { db } from '../db';
import { words } from '../db/schema';
import { count } from 'drizzle-orm';

async function verify() {
  const result = await db.select({ count: count() }).from(words);
  console.log('Total words:', result[0].count);
  process.exit(0);
}

verify().catch(console.error);
