import { createServerFn } from '@tanstack/react-start';
import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { serviciosContactosTable } from '@/db/schemas/servicios-contactos.schema';

const getServiciosContactosSchema = z.object({
  incluirOcultos: z.boolean().default(false),
});

export const getServiciosContactosFn = createServerFn({
  method: 'POST',
})
  .validator(getServiciosContactosSchema)
  .handler(async ({ data }) => {
    if (data.incluirOcultos) {
      const session = await useAppSession();
      const usuarioId = session.data.usuarioId;

      if (!usuarioId) {
        throw new Error('Usuario no autenticado');
      }

      return db
        .select()
        .from(serviciosContactosTable)
        .orderBy(
          asc(serviciosContactosTable.orden),
          asc(serviciosContactosTable.nombre),
        );
    }

    return db
      .select()
      .from(serviciosContactosTable)
      .where(eq(serviciosContactosTable.visible, true))
      .orderBy(
        asc(serviciosContactosTable.orden),
        asc(serviciosContactosTable.nombre),
      );
  });
