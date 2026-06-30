import { createServerFn } from '@tanstack/react-start';
import { and, eq, ilike, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { proyectosMinerosTable } from '@/db/schemas/proyectos-mineros.schema';
import { proyectosMinerosTiposTable } from '@/db/schemas/proyectos-mineros-tipos.schema';
import { proyectosMinerosEtapasTable } from '@/db/schemas/proyectos-mineros-etapas.schema';

export const getProyectosMinerosFn = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      nombreLike: z.string().optional(),
      etapasIds: z.array(z.number().int().positive()).optional(),
      tiposIds: z.array(z.number().int().positive()).optional(),
      visible: z.boolean().optional(),
      limit: z.number().int().positive().optional(),
      offset: z.number().int().min(0).optional(),
    })
  )
  .handler(async ({ data }) => {
    const { nombreLike, etapasIds, tiposIds, visible, limit, offset } = data;

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
      .innerJoin(proyectosMinerosEtapasTable, eq(proyectosMinerosTable.etapaId, proyectosMinerosEtapasTable.id))
      .where(
        and(
          ilike(proyectosMinerosTable.nombre, `%${nombreLike}%`).if(nombreLike !== undefined),
          inArray(proyectosMinerosTable.etapaId, etapasIds!).if(etapasIds !== undefined),
          inArray(proyectosMinerosTable.tipoId, tiposIds!).if(tiposIds !== undefined),
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
