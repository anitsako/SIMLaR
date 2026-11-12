import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { fileURLToPath } from 'node:url';

const raw=process.env.DATABASE_URL;
if(!raw)throw new Error('Falta DATABASE_URL en .env.');
const url=new URL(raw);
if(!['localhost','127.0.0.1','[::1]'].includes(url.hostname)){
  throw new Error('Este comando está limitado a una base local. La migración en el servidor oficial debe ejecutarla su administrador.');
}
const pool=new Pool({connectionString:raw,connectionTimeoutMillis:5000});
try{
  await migrate(drizzle(pool),{migrationsFolder:fileURLToPath(new URL('../drizzle/',import.meta.url))});
  console.log('Migraciones completadas. El panel de ediciones está listo.');
}finally{await pool.end();}
