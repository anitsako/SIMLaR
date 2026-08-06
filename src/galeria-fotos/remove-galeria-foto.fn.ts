import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { createServerFn } from '@tanstack/react-start';
import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { galeriaFotosTable } from '@/db/schemas/galeria-fotos';

const removeGaleriaFotoSchema = z.object({
  fotoId: z.number().int().positive(),
});

export const removeGaleriaFotoFn = createServerFn({ method: 'POST' })
  .validator(removeGaleriaFotoSchema)
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
      const fotos = await tx
        .select({
          archivoImagenId: galeriaFotosTable.archivoImagenId,
          archivoImagenMiniaturaId: galeriaFotosTable.archivoImagenMiniaturaId,
        })
        .from(galeriaFotosTable)
        .where(eq(galeriaFotosTable.id, data.fotoId))
        .limit(1);

      if (fotos.length === 0) {
        throw new Error('Imagen de galería no encontrada');
      }

      const foto = fotos[0];

      await tx.delete(galeriaFotosTable).where(eq(galeriaFotosTable.id, data.fotoId));

      const restantes = await tx
        .select({ id: galeriaFotosTable.id })
        .from(galeriaFotosTable)
        .orderBy(asc(galeriaFotosTable.orden), asc(galeriaFotosTable.id));

      for (const [index, item] of restantes.entries()) {
        await tx.update(galeriaFotosTable).set({ orden: index }).where(eq(galeriaFotosTable.id, item.id));
      }

      await tx.delete(archivosTable).where(eq(archivosTable.id, foto.archivoImagenId));
      await tx.delete(archivosTable).where(eq(archivosTable.id, foto.archivoImagenMiniaturaId));

      await Promise.all(
        [foto.archivoImagenId, foto.archivoImagenMiniaturaId].map(async (id) => {
          await unlink(path.join(filesPath, id)).catch((error) => {
            const isEnoent = typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
            if (!isEnoent) {
              throw error;
            }
          });
        })
      );

      return { fotoId: data.fotoId };
    });
  });
