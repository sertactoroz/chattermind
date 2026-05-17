import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL!;

if (!databaseUrl) {
  console.warn('DATABASE_URL is not defined. Check the .env.local file.');
}

export const sql = neon(databaseUrl);
