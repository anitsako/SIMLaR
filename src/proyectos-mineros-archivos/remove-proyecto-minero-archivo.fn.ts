import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { createServerFn } from '@tanstack/react-start';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { proyectosMinerosArchivosTable } from '@/db/schemas/proyectos-mineros-archivos.schema';

const removeProyectoMineroArchivoSchema = z.object({
  proyectoMineroId: z.number().int().positive(),
  archivoId: z.uuid(),
});

export const removeProyectoMineroArchivoFn = createServerFn({ method: 'POST' })
  .inputValidator(removeProyectoMineroArchivoSchema)
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
      await tx
        .delete(proyectosMinerosArchivosTable)
        .where(
          and(
            eq(proyectosMinerosArchivosTable.proyectoMineroId, data.proyectoMineroId),
            eq(proyectosMinerosArchivosTable.archivoId, data.archivoId)
          )
        );

      try {
        await unlink(path.join(filesPath, data.archivoId));
      } catch (error) {
        const isEnoent = typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
        if (!isEnoent) {
          throw error;
        }
      }

      await tx.delete(archivosTable).where(eq(archivosTable.id, data.archivoId));

      return { archivoId: data.archivoId };
    });
  });
