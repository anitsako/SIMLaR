import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import {
  and,
  count,
  eq,
  gte,
  ilike,
  inArray,
  lte,
} from 'drizzle-orm';

import { db } from '@/db';
import { proyectosMinerosTable } from '@/db/schemas/proyectos-mineros.schema';

export const getProyectosMinerosCountFn = createServerFn({
  method: 'GET',
})
  .validator(
    z.object({
      nombreLike: z.string().optional(),
      tiposIds: z.array(z.number().int().positive()).optional(),
      etapasIds: z.array(z.number().int().positive()).optional(),
      minerales: z.array(z.string()).optional(),
      ubicaciones: z.array(z.string()).optional(),
      propietarios: z.array(z.string()).optional(),
      provinciasGeologicas: z.array(z.string()).optional(),
      convenioEmse: z.boolean().optional(),
      visible: z.boolean().optional(),
      msnmDesde: z.number().int().optional(),
      msnmHasta: z.number().int().optional(),
    })
  )
  .handler(async ({ data }) => {
    const {
      nombreLike,
      tiposIds,
      etapasIds,
      minerales,
      ubicaciones,
      propietarios,
      provinciasGeologicas,
      convenioEmse,
      visible,
      msnmDesde,
      msnmHasta,
    } = data;

    return db
      .select({
        count: count(),
      })
      .from(proyectosMinerosTable)
      .where(
        and(
          ilike(proyectosMinerosTable.nombre, `%${nombreLike}%`).if(
            Boolean(nombreLike?.trim())
          ),
          inArray(proyectosMinerosTable.tipoId, tiposIds!).if(
            Boolean(tiposIds?.length)
          ),
          inArray(proyectosMinerosTable.etapaId, etapasIds!).if(
            Boolean(etapasIds?.length)
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
      .then((result) => result[0]?.count ?? 0);
  });
