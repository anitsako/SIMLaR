import { createServerFn } from '@tanstack/react-start';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { archivosContenidosTable } from '@/db/schemas/archivos-contenidos.schema';
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

    return db.transaction(async (tx) => {
      await tx
        .delete(proyectosMinerosArchivosTable)
        .where(
          and(
            eq(proyectosMinerosArchivosTable.proyectoMineroId, data.proyectoMineroId),
            eq(proyectosMinerosArchivosTable.archivoId, data.archivoId)
          )
        );

      await tx.delete(archivosContenidosTable).where(eq(archivosContenidosTable.archivoId, data.archivoId));
      await tx.delete(archivosTable).where(eq(archivosTable.id, data.archivoId));

      return { archivoId: data.archivoId };
    });
  });
