import { createServerFn } from '@tanstack/react-start';
import { inArray } from 'drizzle-orm';
import { db } from '@/db';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { galeriaFotosTable } from '@/db/schemas/galeria-fotos';

export const getGaleriaFotosFn = createServerFn({ method: 'GET' }).handler(async () => {
  const fotos = await db
    .select({
      id: galeriaFotosTable.id,
      orden: galeriaFotosTable.orden,
      descripcion: galeriaFotosTable.descripcion,
      archivoImagenId: galeriaFotosTable.archivoImagenId,
      archivoImagenMiniaturaId: galeriaFotosTable.archivoImagenMiniaturaId,
      fechaCreacion: galeriaFotosTable.fechaCreacion,
    })
    .from(galeriaFotosTable)
    .orderBy(galeriaFotosTable.orden, galeriaFotosTable.id);

  const archivoIds = [...new Set(fotos.flatMap((foto) => [foto.archivoImagenId, foto.archivoImagenMiniaturaId]))];
  const archivos =
    archivoIds.length === 0
      ? []
      : await db
          .select({
            id: archivosTable.id,
            nombre: archivosTable.nombre,
            mimeType: archivosTable.mimeType,
          })
          .from(archivosTable)
          .where(inArray(archivosTable.id, archivoIds));

  const archivoMap = new Map(archivos.map((archivo) => [archivo.id, archivo]));

  return fotos.map((foto) => ({
    ...foto,
    archivoImagen: archivoMap.get(foto.archivoImagenId),
    archivoImagenMiniatura: archivoMap.get(foto.archivoImagenMiniaturaId),
  }));
});
