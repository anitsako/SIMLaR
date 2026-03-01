import { createServerFn } from '@tanstack/react-start';
import { and, eq, ilike } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { proyectosMinerosTable } from '../db/schemas/proyectos-mineros.schema';
import { proyectosMinerosTiposTable } from '@/db/schemas/proyectos-mineros-tipos.schema';

export const getProyectosMinerosFn = createServerFn({
  method: 'GET',
})
  .inputValidator(z.object({ nombreLike: z.string().optional(), visible: z.boolean().optional() }))
  .handler(async ({ data }) => {
    const { visible } = data;
    return db
      .select({
        id: proyectosMinerosTable.id,
        nombre: proyectosMinerosTable.nombre,
        tipo: {
          id: proyectosMinerosTiposTable.id,
          nombre: proyectosMinerosTiposTable.nombre,
          color: proyectosMinerosTiposTable.color,
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
      .orderBy(proyectosMinerosTable.nombre);
  });
