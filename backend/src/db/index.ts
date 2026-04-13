import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: '.env' }); // or .env.local

const client = postgres(process.env.DB_URI!, {
  onnotice: () => {},
});

client`SELECT 1`
  .then(() => console.log('Database is connected'))
  .catch((err) => console.error('Database connection failed:', err));

export const db = drizzle({ client });
