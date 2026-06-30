import { createServerFn } from '@tanstack/react-start';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { proyectosMinerosArchivosTable } from '@/db/schemas/proyectos-mineros-archivos.schema';

export const getProyectoMineroArchivosFn = createServerFn({ method: 'GET' })
  .validator(z.object({ proyectoMineroId: z.number().int().positive() }))
  .handler(async ({ data }) => {
    return db
      .select({
        archivoId: archivosTable.id,
        nombre: archivosTable.nombre,
        tamaño: archivosTable.tamaño,
        mimeType: archivosTable.mimeType,
        fechaCreacion: proyectosMinerosArchivosTable.fechaCreacion,
      })
      .from(proyectosMinerosArchivosTable)
      .innerJoin(archivosTable, eq(proyectosMinerosArchivosTable.archivoId, archivosTable.id))
      .where(eq(proyectosMinerosArchivosTable.proyectoMineroId, data.proyectoMineroId))
      .orderBy(archivosTable.nombre);
  });
