import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { sql } from 'drizzle-orm';
import { detectImageMime } from '@/common/detect-image-mime';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { proyectosMinerosTable } from '@/db/schemas/proyectos-mineros.schema';
import { archivosTable } from '@/db/schemas/archivos.schema';

const createProyectoMineroSchema = z.object({
  nombre: z.string().min(1).max(100),
  tipoId: z.number().int().positive(),
  ubicacion: z.string().min(1).max(100),
  provinciaGeologica: z.string().min(1).max(100),
  areaHectareas: z.number().positive().max(99_999_999.99),
  litologia: z.string().min(1),
  mineralizacion: z.string().min(1),
  mineralInteres: z.string().min(1).max(100),
  modeloGenetico: z.string(),
  accesos: z.string().min(1),
  etapaId: z.number().int().positive(),
  propietario: z.string().min(1).max(100),
  localidadesCercanas: z.string().min(1).max(100),
  coordenadasGeograficas: z.object({ lat: z.number(), lng: z.number() }),
  msnm: z.number().int(),
  convenioEmse: z.boolean(),
  visible: z.boolean().default(true),
  archivoMapa: z.object({
    nombre: z.string(),
    tamaño: z.number(),
    mimeType: z.string(),
    base64: z.string(),
  }),
});

export const createProyectoMineroFn = createServerFn({ method: 'POST' })
  .validator(createProyectoMineroSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const usuarioId = session.data.usuarioId;

    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }

    const filesPath = process.env.FILES_PATH;
    if (!filesPath) {
      throw new Error('FILES_PATH no está definida');
    }
    await mkdir(filesPath, { recursive: true });

    const maxTamañoArchivo = 5 * 1024 * 1024; // 5MB de tamaño maximo
    const { archivoMapa, areaHectareas, ...fields } = data;
    const buffer = Buffer.from(archivoMapa.base64, 'base64');

    if (buffer.length > maxTamañoArchivo) {
      throw new Error('Archivo excede el tamaño máximo permitido de 5MB');
    }

    const mime = detectImageMime(buffer);

    if (!mime) {
      throw new Error('Archivo no es una imagen válida (JPG, PNG o WEBP)');
    }

    const proyectoMinero = await db.transaction(async (tx) => {
      const [nuevoArchivoMapa] = await tx
        .insert(archivosTable)
        .values({
          nombre: archivoMapa.nombre,
          tamaño: archivoMapa.tamaño,
          mimeType: archivoMapa.mimeType,
          usuarioCreadorId: usuarioId,
          usuarioModificadorId: usuarioId,
        })
        .returning();

      await writeFile(path.join(filesPath, nuevoArchivoMapa.id), buffer);

      const [nuevoProyectoMinero] = await tx
        .insert(proyectosMinerosTable)
        .values({
          ...fields,
          area: String(Math.round(areaHectareas)),
          areaHectareas: Math.round(areaHectareas * 100) / 100,
          coordenadasGeograficas: sql`ST_SetSRID(ST_MakePoint(${fields.coordenadasGeograficas.lng}, ${fields.coordenadasGeograficas.lat}), 4326)`,
          archivoMapaId: nuevoArchivoMapa.id,
          usuarioCreadorId: usuarioId,
          usuarioModificadorId: usuarioId,
        })
        .returning();

      return nuevoProyectoMinero;
    });

    return proyectoMinero;
  });
