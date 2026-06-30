import { createServerFn } from '@tanstack/react-start';
import { asc, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { carrouselImagenesTable } from '@/db/schemas/carrousel-imagenes.schema';

const updateImagenCarrouselSchema = z
  .object({
    archivoId: z.uuid(),
    positionY: z.number().int().min(0).max(100).optional(),
    move: z.enum(['up', 'down']).optional(),
  })
  .refine((value) => value.positionY !== undefined || value.move !== undefined, {
    message: 'Debe enviar positionY o move',
  });

export const updateImagenCarrouselFn = createServerFn({ method: 'POST' })
  .validator(updateImagenCarrouselSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const usuarioId = session.data.usuarioId;

    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }

    return db.transaction(async (tx) => {
      const actuales = await tx
        .select({ archivoId: carrouselImagenesTable.archivoId, orden: carrouselImagenesTable.orden })
        .from(carrouselImagenesTable)
        .where(eq(carrouselImagenesTable.archivoId, data.archivoId))
        .limit(1);

      if (actuales.length === 0) {
        throw new Error('Imagen de carrusel no encontrada');
      }
      const actual = actuales[0];

      if (data.move) {
        const vecinos = await tx
          .select({ archivoId: carrouselImagenesTable.archivoId, orden: carrouselImagenesTable.orden })
          .from(carrouselImagenesTable)
          .where(
            data.move === 'up'
              ? sql`${carrouselImagenesTable.orden} < ${actual.orden}`
              : sql`${carrouselImagenesTable.orden} > ${actual.orden}`
          )
          .orderBy(data.move === 'up' ? desc(carrouselImagenesTable.orden) : asc(carrouselImagenesTable.orden))
          .limit(1);

        if (vecinos.length > 0) {
          const vecino = vecinos[0];

          await tx
            .update(carrouselImagenesTable)
            .set({ orden: vecino.orden, usuarioModificadorId: usuarioId })
            .where(eq(carrouselImagenesTable.archivoId, actual.archivoId));

          await tx
            .update(carrouselImagenesTable)
            .set({ orden: actual.orden, usuarioModificadorId: usuarioId })
            .where(eq(carrouselImagenesTable.archivoId, vecino.archivoId));
        }
      }

      if (data.positionY !== undefined) {
        await tx
          .update(carrouselImagenesTable)
          .set({ positionY: data.positionY, usuarioModificadorId: usuarioId })
          .where(eq(carrouselImagenesTable.archivoId, data.archivoId));
      }

      const [actualizada] = await tx
        .select({
          archivoId: carrouselImagenesTable.archivoId,
          positionY: carrouselImagenesTable.positionY,
          orden: carrouselImagenesTable.orden,
        })
        .from(carrouselImagenesTable)
        .where(eq(carrouselImagenesTable.archivoId, data.archivoId));

      return actualizada;
    });
  });
