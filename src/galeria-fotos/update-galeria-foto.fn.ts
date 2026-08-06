import { createServerFn } from '@tanstack/react-start';
import { asc, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { galeriaFotosTable } from '@/db/schemas/galeria-fotos';

const updateGaleriaFotoSchema = z
  .object({
    fotoId: z.number().int().positive(),
    descripcion: z.string().min(1).max(500).optional(),
    move: z.enum(['up', 'down']).optional(),
  })
  .refine((value) => value.descripcion !== undefined || value.move !== undefined, {
    message: 'Debe enviar descripcion o move',
  });

export const updateGaleriaFotoFn = createServerFn({ method: 'POST' })
  .validator(updateGaleriaFotoSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const usuarioId = session.data.usuarioId;

    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }

    return db.transaction(async (tx) => {
      const actuales = await tx
        .select({ id: galeriaFotosTable.id, orden: galeriaFotosTable.orden })
        .from(galeriaFotosTable)
        .where(eq(galeriaFotosTable.id, data.fotoId))
        .limit(1);

      if (actuales.length === 0) {
        throw new Error('Imagen de galería no encontrada');
      }

      const actual = actuales[0];

      if (data.move) {
        const vecinos = await tx
          .select({ id: galeriaFotosTable.id, orden: galeriaFotosTable.orden })
          .from(galeriaFotosTable)
          .where(
            data.move === 'up'
              ? sql`${galeriaFotosTable.orden} < ${actual.orden}`
              : sql`${galeriaFotosTable.orden} > ${actual.orden}`
          )
          .orderBy(data.move === 'up' ? desc(galeriaFotosTable.orden) : asc(galeriaFotosTable.orden))
          .limit(1);

        if (vecinos.length > 0) {
          const vecino = vecinos[0];

          await tx.update(galeriaFotosTable).set({ orden: vecino.orden }).where(eq(galeriaFotosTable.id, actual.id));

          await tx.update(galeriaFotosTable).set({ orden: actual.orden }).where(eq(galeriaFotosTable.id, vecino.id));
        }
      }

      if (data.descripcion !== undefined) {
        await tx
          .update(galeriaFotosTable)
          .set({ descripcion: data.descripcion })
          .where(eq(galeriaFotosTable.id, data.fotoId));
      }

      const [actualizada] = await tx
        .select({
          id: galeriaFotosTable.id,
          orden: galeriaFotosTable.orden,
          descripcion: galeriaFotosTable.descripcion,
        })
        .from(galeriaFotosTable)
        .where(eq(galeriaFotosTable.id, data.fotoId));

      return actualizada;
    });
  });
