import { createServerFn } from '@tanstack/react-start';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { carrouselImagenesTable } from '@/db/schemas/carrousel-imagenes.schema';
import { archivosTable } from '@/db/schemas/archivos.schema';

export const getImagenesCarrouselFn = createServerFn({ method: 'GET' }).handler(async () => {
  const imagenes = await db
    .select({
      archivoId: carrouselImagenesTable.archivoId,
      positionY: carrouselImagenesTable.positionY,
      orden: carrouselImagenesTable.orden,
      nombre: archivosTable.nombre,
      mimeType: archivosTable.mimeType,
    })
    .from(carrouselImagenesTable)
    .innerJoin(archivosTable, eq(carrouselImagenesTable.archivoId, archivosTable.id))
    .orderBy(carrouselImagenesTable.orden);
  return imagenes;
});
