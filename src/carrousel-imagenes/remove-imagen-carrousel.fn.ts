import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { createServerFn } from '@tanstack/react-start';
import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { carrouselImagenesTable } from '@/db/schemas/carrousel-imagenes.schema';

const removeImagenCarrouselSchema = z.object({
  archivoId: z.uuid(),
});

export const removeImagenCarrouselFn = createServerFn({ method: 'POST' })
  .inputValidator(removeImagenCarrouselSchema)
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

    return db.transaction(async (tx) => {
      const imagenes = await tx
        .select({ archivoId: carrouselImagenesTable.archivoId })
        .from(carrouselImagenesTable)
        .where(eq(carrouselImagenesTable.archivoId, data.archivoId));

      if (imagenes.length === 0) {
        throw new Error('Imagen de carrusel no encontrada');
      }

      await tx.delete(carrouselImagenesTable).where(eq(carrouselImagenesTable.archivoId, data.archivoId));

      const imagenesRestantes = await tx
        .select({ archivoId: carrouselImagenesTable.archivoId })
        .from(carrouselImagenesTable)
        .orderBy(asc(carrouselImagenesTable.orden));

      for (const [index, item] of imagenesRestantes.entries()) {
        await tx
          .update(carrouselImagenesTable)
          .set({ orden: index, usuarioModificadorId: usuarioId })
          .where(eq(carrouselImagenesTable.archivoId, item.archivoId));
      }

      await tx.delete(archivosTable).where(eq(archivosTable.id, data.archivoId));

      try {
        await unlink(path.join(filesPath, data.archivoId));
      } catch (error) {
        const isEnoent = typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
        if (!isEnoent) {
          throw error;
        }
      }

      return { archivoId: data.archivoId };
    });
  });
