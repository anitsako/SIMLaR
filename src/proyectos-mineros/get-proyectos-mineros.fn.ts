import { createServerFn } from '@tanstack/react-start';
import { and, eq, ilike } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { proyectosMinerosTable } from '../db/schemas/proyectos-mineros.schema';
import { getProyectosMinerosCountFn } from './get-proyectos-mineros-count-fn';
import { proyectosMinerosTiposTable } from '@/db/schemas/proyectos-mineros-tipos.schema';

export const getProyectosMinerosFn = createServerFn({
  method: 'GET',
})
  .inputValidator(
    z.object({
      nombreLike: z.string().optional(),
      visible: z.boolean().optional(),
      page: z.number().int().positive().optional().default(1),
      limit: z.number().int().positive().optional().default(8),
    })
  )
  .handler(async ({ data }) => {
    const { visible, page, limit } = data;
    const offset = (page - 1) * limit;

    const result = await db
      .select({
        id: proyectosMinerosTable.id,
        nombre: proyectosMinerosTable.nombre,
        tipo: {
          id: proyectosMinerosTiposTable.id,
          nombre: proyectosMinerosTiposTable.nombre,
          forma: proyectosMinerosTiposTable.forma,
        },
        ubicacion: proyectosMinerosTable.ubicacion,
        mineral: proyectosMinerosTable.mineralInteres,
        etapa: proyectosMinerosTable.etapa,
        propietario: proyectosMinerosTable.propietario,
        coordenadasGeograficas: proyectosMinerosTable.coordenadasGeograficas,
      })
      .from(proyectosMinerosTable)
      .innerJoin(proyectosMinerosTiposTable, eq(proyectosMinerosTable.tipoId, proyectosMinerosTiposTable.id))
      .where(
        and(
          ilike(proyectosMinerosTable.nombre, `%${data.nombreLike}%`).if(data.nombreLike !== undefined),
          eq(proyectosMinerosTable.visible, visible!).if(visible !== undefined)
        )
      )
      .orderBy(proyectosMinerosTable.nombre)
      .limit(limit)
      .offset(offset);

    return {
      result,
      nombreLike: data.nombreLike,
      page,
      limit,
      total: await getProyectosMinerosCountFn({ data: { visible } }),
    };
  });
