import { createServerFn } from '@tanstack/react-start';
import { and, eq, ilike } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { proyectosMinerosTable } from '@/db/schemas/proyectos-mineros.schema';
import { proyectosMinerosTiposTable } from '@/db/schemas/proyectos-mineros-tipos.schema';
import { proyectosMinerosEtapasTable } from '@/db/schemas/proyectos-mineros-etapas.schema';

export const getProyectosMinerosFn = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      nombreLike: z.string().optional(),
      visible: z.boolean().optional(),
      limit: z.number().int().positive().optional(),
      offset: z.number().int().min(0).optional(),
    })
  )
  .handler(async ({ data }) => {
    const { nombreLike, visible, limit, offset } = data;

    const proyectosMineros = db
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
        etapa: {
          id: proyectosMinerosEtapasTable.id,
          nombre: proyectosMinerosEtapasTable.nombre,
          color: proyectosMinerosEtapasTable.color,
        },
        propietario: proyectosMinerosTable.propietario,
        coordenadasGeograficas: proyectosMinerosTable.coordenadasGeograficas,
      })
      .from(proyectosMinerosTable)
      .innerJoin(proyectosMinerosTiposTable, eq(proyectosMinerosTable.tipoId, proyectosMinerosTiposTable.id))
      .leftJoin(proyectosMinerosEtapasTable, eq(proyectosMinerosTable.etapaId, proyectosMinerosEtapasTable.id))
      .where(
        and(
          ilike(proyectosMinerosTable.nombre, `%${nombreLike}%`).if(nombreLike !== undefined),
          eq(proyectosMinerosTable.visible, visible!).if(visible !== undefined)
        )
      )
      .orderBy(proyectosMinerosTable.nombre);

    if (limit !== undefined) {
      proyectosMineros.limit(limit);
    }

    if (offset !== undefined) {
      proyectosMineros.offset(offset);
    }

    return proyectosMineros;
  });
