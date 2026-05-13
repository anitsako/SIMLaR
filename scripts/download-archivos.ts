import 'dotenv/config';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { archivosContenidosTable } from '../src/db/schemas/archivos-contenidos.schema';

export async function descargarArchivosDesdeDb(databaseUrlEnvVar: 'DATABASE_URL' | 'DATABASE_PROD_URL') {
  const filesPath = process.env.FILES_PATH;
  const databaseUrl = process.env[databaseUrlEnvVar];

  if (!filesPath) {
    throw new Error('FILES_PATH no esta definida');
  }

  if (!databaseUrl) {
    throw new Error(`${databaseUrlEnvVar} no esta definida`);
  }

  await mkdir(filesPath, { recursive: true });

  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle({ client: pool });

  try {
    const archivos = await db
      .select({
        archivoId: archivosContenidosTable.archivoId,
        contenido: archivosContenidosTable.contenido,
      })
      .from(archivosContenidosTable);

    for (const archivo of archivos) {
      const filePath = path.join(filesPath, archivo.archivoId);
      const buffer = Buffer.isBuffer(archivo.contenido)
        ? archivo.contenido
        : Buffer.from(archivo.contenido);

      await writeFile(filePath, buffer);
    }

    console.info(`Archivos descargados: ${archivos.length}`);
  } finally {
    await pool.end();
  }
}
