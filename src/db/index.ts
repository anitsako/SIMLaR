import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const pool = new Pool({
  connectionString: process.env.NODE_ENV !== 'test' ? process.env.DATABASE_URL : process.env.DATABASE_TEST_URL,
});

export const db = drizzle({ client: pool });
