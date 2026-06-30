import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { and, count, eq, ilike } from 'drizzle-orm';
import { db } from '@/db';
import { proyectosMinerosTable } from '@/db/schemas/proyectos-mineros.schema';

export const getProyectosMinerosCountFn = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      nombreLike: z.string().optional(),
      visible: z.boolean().optional(),
    })
  )
  .handler(async ({ data }) => {
    const { nombreLike, visible } = data;

    return db
      .select({ count: count() })
      .from(proyectosMinerosTable)
      .where(
        and(
          ilike(proyectosMinerosTable.nombre, `%${nombreLike}%`).if(nombreLike !== undefined),
          eq(proyectosMinerosTable.visible, visible!).if(visible !== undefined)
        )
      )
      .then((r) => r[0]?.count ?? 0);
  });
