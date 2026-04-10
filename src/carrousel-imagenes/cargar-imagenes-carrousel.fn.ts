import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { inArray } from 'drizzle-orm';
import { db } from '@/db';
import { useAppSession } from '@/auth/use-app-session';
import { carrouselImagenesTable } from '@/db/schemas/carrousel-imagenes.schema';
import { archivosTable } from '@/db/schemas/archivos.schema';

const cargarImagenesCarrouselSchema = z.object({
  imagenes: z
    .array(
      z.object({
        archivoId: z.string().uuid(),
        positionY: z.number().int(),
        orden: z.number().int(),
      })
    )
    .length(4), // Exactamente 4 imágenes
});

export const cargarImagenesCarrouselFn = createServerFn({ method: 'POST' })
  .inputValidator(cargarImagenesCarrouselSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const usuarioId = session.data.usuarioId;

    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }

    // Validar que todos los archivos existen
    const archivos = await db
      .select()
      .from(archivosTable)
      .where(
        inArray(
          archivosTable.id,
          data.imagenes.map((img) => img.archivoId)
        )
      );
    const archivoIds = new Set(archivos.map((a) => a.id));

    for (const img of data.imagenes) {
      if (!archivoIds.has(img.archivoId)) {
        throw new Error(`Archivo no encontrado: ${img.archivoId}`);
      }
    }

    // Borrar las imágenes actuales del carrusel
    await db.delete(carrouselImagenesTable);

    // Insertar las 4 nuevas
    const resultado = await db
      .insert(carrouselImagenesTable)
      .values(
        data.imagenes.map((img, index) => ({
          archivoId: img.archivoId,
          positionY: img.positionY,
          orden: index,
          usuarioCreadorId: usuarioId,
          usuarioModificadorId: usuarioId,
        }))
      )
      .returning();

    return resultado;
  });
