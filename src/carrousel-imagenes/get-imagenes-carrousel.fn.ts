import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { carrouselImagenesTable } from '@/db/schemas/carrousel-imagenes.schema';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { archivosContenidosTable } from '@/db/schemas/archivos-contenidos.schema';

export const getImagenesCarrouselFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({}))
  .handler(async () => {
    const imagenes = await db
      .select({
        archivoId: carrouselImagenesTable.archivoId,
        positionY: carrouselImagenesTable.positionY,
        orden: carrouselImagenesTable.orden,
        nombre: archivosTable.nombre,
        mimeType: archivosTable.mimeType,
        base64: sql<string>`encode(${archivosContenidosTable.contenido}, 'base64')`,
      })
      .from(carrouselImagenesTable)
      .innerJoin(archivosTable, eq(carrouselImagenesTable.archivoId, archivosTable.id))
      .innerJoin(archivosContenidosTable, eq(carrouselImagenesTable.archivoId, archivosContenidosTable.archivoId))
      .orderBy(sql`${carrouselImagenesTable.orden} ASC`);
    return imagenes;
  });
