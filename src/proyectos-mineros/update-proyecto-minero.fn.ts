import { createServerFn } from '@tanstack/react-start';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { detectImageMime } from '@/common/detect-image-mime';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { proyectosMinerosTable } from '@/db/schemas/proyectos-mineros.schema';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { archivosContenidosTable } from '@/db/schemas/archivos-contenidos.schema';

const updateProyectoMineroSchema = z.object({
  id: z.number().int().positive(),
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
  visible: z.boolean(),
  archivoMapa: z
    .object({
      nombre: z.string(),
      tamaño: z.number(),
      mimeType: z.string(),
      base64: z.string(),
    })
    .optional(),
});

export const updateProyectoMineroFn = createServerFn({ method: 'POST' })
  .inputValidator(updateProyectoMineroSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const usuarioId = session.data.usuarioId;

    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }

    const { id, archivoMapa, ...fields } = data;

    const proyectoMinero = await db.transaction(async (tx) => {
      if (archivoMapa) {
        const maxTamañoArchivo = 5 * 1024 * 1024;
        const buffer = Buffer.from(archivoMapa.base64, 'base64');

        if (buffer.length > maxTamañoArchivo) {
          throw new Error('Archivo excede el tamaño máximo permitido de 5MB');
        }

        const mime = detectImageMime(buffer);

        if (!mime) {
          throw new Error('Archivo no es una imagen válida (JPG, PNG o WEBP)');
        }

        const proyectoActual = await tx
          .select({ archivoMapaId: proyectosMinerosTable.archivoMapaId })
          .from(proyectosMinerosTable)
          .where(eq(proyectosMinerosTable.id, id));

        if (proyectoActual.length === 0) {
          throw new Error('Proyecto minero no encontrado');
        }

        const archivoMapaActualId = proyectoActual[0].archivoMapaId;

        await tx
          .update(archivosTable)
          .set({
            nombre: archivoMapa.nombre,
            tamaño: archivoMapa.tamaño,
            mimeType: archivoMapa.mimeType,
            usuarioModificadorId: usuarioId,
          })
          .where(eq(archivosTable.id, archivoMapaActualId));

        await tx
          .update(archivosContenidosTable)
          .set({ contenido: buffer })
          .where(eq(archivosContenidosTable.archivoId, archivoMapaActualId));
      }

      const [proyectoActualizado] = await tx
        .update(proyectosMinerosTable)
        .set({
          ...fields,
          coordenadasGeograficas: sql`ST_SetSRID(ST_MakePoint(${fields.coordenadasGeograficas.lng}, ${fields.coordenadasGeograficas.lat}), 4326)`,
          usuarioModificadorId: usuarioId,
        })
        .where(eq(proyectosMinerosTable.id, id))
        .returning();

      return proyectoActualizado;
    });

    return proyectoMinero;
  });
