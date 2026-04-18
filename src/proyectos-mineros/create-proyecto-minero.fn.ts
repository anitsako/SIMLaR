import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { sql } from 'drizzle-orm';
import { detectImageMime } from '@/common/detect-image-mime';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { proyectosMinerosTable } from '@/db/schemas/proyectos-mineros.schema';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { archivosContenidosTable } from '@/db/schemas/archivos-contenidos.schema';

const createProyectoMineroSchema = z.object({
  nombre: z.string().min(1).max(100),
  tipoId: z.number().int().positive(),
  ubicacion: z.string().min(1).max(100),
  provinciaGeologica: z.string().min(1).max(100),
  area: z.string().min(1).max(10),
  litologia: z.string().min(1),
  mineralizacion: z.string().min(1),
  mineralInteres: z.string().min(1).max(100),
  modeloGenetico: z.string().min(1),
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
  .inputValidator(createProyectoMineroSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const usuarioId = session.data.usuarioId;

    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }

    const maxTamañoArchivo = 5 * 1024 * 1024; // 5MB de tamaño maximo
    const { archivoMapa } = data;
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

      await tx.insert(archivosContenidosTable).values({ archivoId: nuevoArchivoMapa.id, contenido: buffer });

      const [nuevoProyectoMinero] = await tx
        .insert(proyectosMinerosTable)
        .values({
          ...data,
          coordenadasGeograficas: sql`ST_SetSRID(ST_MakePoint(${data.coordenadasGeograficas.lng}, ${data.coordenadasGeograficas.lat}), 4326)`,
          archivoMapaId: nuevoArchivoMapa.id,
          usuarioCreadorId: usuarioId,
          usuarioModificadorId: usuarioId,
        })
        .returning();

      return nuevoProyectoMinero;
    });

    return proyectoMinero;
  });
