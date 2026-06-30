import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createServerFn } from '@tanstack/react-start';
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { useAppSession } from '@/auth/use-app-session';
import { detectImageMime } from '@/common/detect-image-mime';
import { db } from '@/db';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { carrouselImagenesTable } from '@/db/schemas/carrousel-imagenes.schema';

const addImagenCarrouselSchema = z.object({
  archivo: z.object({
    nombre: z.string().min(1).max(500),
    tamaño: z.number().int().positive(),
    mimeType: z.string().min(1).max(100),
    base64: z.string().min(1),
  }),
});

export const addImagenCarrouselFn = createServerFn({ method: 'POST' })
  .validator(addImagenCarrouselSchema)
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

    const buffer = Buffer.from(data.archivo.base64, 'base64');
    const maxSize = 5 * 1024 * 1024;

    if (buffer.length === 0) {
      throw new Error('Archivo vacío');
    }

    if (buffer.length > maxSize) {
      throw new Error('El archivo supera los 5MB');
    }

    const mimeDetectado = detectImageMime(buffer);
    if (!mimeDetectado) {
      throw new Error('Archivo no es una imagen válida');
    }

    return db.transaction(async (tx) => {
      const [ordenActual] = await tx
        .select({
          maxOrden: sql<number>`coalesce(max(${carrouselImagenesTable.orden}), -1)`,
        })
        .from(carrouselImagenesTable);

      const [archivo] = await tx
        .insert(archivosTable)
        .values({
          nombre: data.archivo.nombre,
          tamaño: buffer.length,
          mimeType: mimeDetectado,
          usuarioCreadorId: usuarioId,
          usuarioModificadorId: usuarioId,
        })
        .returning({
          id: archivosTable.id,
          nombre: archivosTable.nombre,
          mimeType: archivosTable.mimeType,
        });

      await writeFile(path.join(filesPath, archivo.id), buffer);

      const [imagen] = await tx
        .insert(carrouselImagenesTable)
        .values({
          archivoId: archivo.id,
          positionY: 50,
          orden: ordenActual.maxOrden + 1,
          usuarioCreadorId: usuarioId,
          usuarioModificadorId: usuarioId,
        })
        .returning({
          archivoId: carrouselImagenesTable.archivoId,
          positionY: carrouselImagenesTable.positionY,
          orden: carrouselImagenesTable.orden,
        });

      return {
        ...imagen,
        nombre: archivo.nombre,
        mimeType: archivo.mimeType,
      };
    });
  });
