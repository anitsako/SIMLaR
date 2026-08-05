import { createServerFn } from '@tanstack/react-start';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { proyectosMinerosTable } from '@/db/schemas/proyectos-mineros.schema';

const uniqueSorted = (values: Array<string | null>) => {
  const normalizados = values
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

  return Array.from(new Set(normalizados)).sort((a, b) =>
    a.localeCompare(b, 'es', { sensitivity: 'base' })
  );
};

export const getProyectosMinerosFilterOptionsFn = createServerFn({
  method: 'GET',
})
  .validator(
    z.object({
      visible: z.boolean().optional(),
    })
  )
  .handler(async ({ data }) => {
    const proyectos = await db
      .select({
        mineral: proyectosMinerosTable.mineralInteres,
        ubicacion: proyectosMinerosTable.ubicacion,
        propietario: proyectosMinerosTable.propietario,
        provinciaGeologica: proyectosMinerosTable.provinciaGeologica,
      })
      .from(proyectosMinerosTable)
      .where(
        and(
          eq(proyectosMinerosTable.visible, data.visible!).if(
            data.visible !== undefined
          )
        )
      );

    return {
      minerales: uniqueSorted(proyectos.map((proyecto) => proyecto.mineral)),
      ubicaciones: uniqueSorted(proyectos.map((proyecto) => proyecto.ubicacion)),
      propietarios: uniqueSorted(proyectos.map((proyecto) => proyecto.propietario)),
      provinciasGeologicas: uniqueSorted(
        proyectos.map((proyecto) => proyecto.provinciaGeologica)
      ),
    };
  });
