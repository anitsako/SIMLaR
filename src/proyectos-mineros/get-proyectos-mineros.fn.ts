import { createServerFn } from '@tanstack/react-start';
import {
  and,
  eq,
  gte,
  ilike,
  inArray,
  lte,
} from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { proyectosMinerosTable } from '@/db/schemas/proyectos-mineros.schema';
import { proyectosMinerosTiposTable } from '@/db/schemas/proyectos-mineros-tipos.schema';
import { proyectosMinerosEtapasTable } from '@/db/schemas/proyectos-mineros-etapas.schema';

export const getProyectosMinerosFn = createServerFn({
  method: 'GET',
})
  .validator(
    z.object({
      nombreLike: z.string().optional(),
      etapasIds: z.array(z.number().int().positive()).optional(),
      tiposIds: z.array(z.number().int().positive()).optional(),
      minerales: z.array(z.string()).optional(),
      ubicaciones: z.array(z.string()).optional(),
      propietarios: z.array(z.string()).optional(),
      provinciasGeologicas: z.array(z.string()).optional(),
      convenioEmse: z.boolean().optional(),
      visible: z.boolean().optional(),
      msnmDesde: z.number().int().optional(),
      msnmHasta: z.number().int().optional(),
      limit: z.number().int().positive().optional(),
      offset: z.number().int().min(0).optional(),
    })
  )
  .handler(async ({ data }) => {
    const {
      nombreLike,
      etapasIds,
      tiposIds,
      minerales,
      ubicaciones,
      propietarios,
      provinciasGeologicas,
      convenioEmse,
      visible,
      msnmDesde,
      msnmHasta,
      limit,
      offset,
    } = data;

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
      .innerJoin(
        proyectosMinerosTiposTable,
        eq(proyectosMinerosTable.tipoId, proyectosMinerosTiposTable.id)
      )
      .innerJoin(
        proyectosMinerosEtapasTable,
        eq(proyectosMinerosTable.etapaId, proyectosMinerosEtapasTable.id)
      )
      .where(
        and(
          ilike(proyectosMinerosTable.nombre, `%${nombreLike}%`).if(
            Boolean(nombreLike?.trim())
          ),
          inArray(proyectosMinerosTable.etapaId, etapasIds!).if(
            Boolean(etapasIds?.length)
          ),
          inArray(proyectosMinerosTable.tipoId, tiposIds!).if(
            Boolean(tiposIds?.length)
          ),
          inArray(proyectosMinerosTable.mineralInteres, minerales!).if(
            Boolean(minerales?.length)
          ),
          inArray(proyectosMinerosTable.ubicacion, ubicaciones!).if(
            Boolean(ubicaciones?.length)
          ),
          inArray(proyectosMinerosTable.propietario, propietarios!).if(
            Boolean(propietarios?.length)
          ),
          inArray(
            proyectosMinerosTable.provinciaGeologica,
            provinciasGeologicas!
          ).if(Boolean(provinciasGeologicas?.length)),
          eq(proyectosMinerosTable.convenioEmse, convenioEmse!).if(
            convenioEmse !== undefined
          ),
          eq(proyectosMinerosTable.visible, visible!).if(visible !== undefined),
          gte(proyectosMinerosTable.msnm, msnmDesde!).if(
            msnmDesde !== undefined
          ),
          lte(proyectosMinerosTable.msnm, msnmHasta!).if(
            msnmHasta !== undefined
          )
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
