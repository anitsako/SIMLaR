import { createServerFn } from '@tanstack/react-start';
import {
  and,
  count,
  eq,
  gte,
  ilike,
  inArray,
  lte,
  sql,
} from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { proyectosMinerosTable } from '@/db/schemas/proyectos-mineros.schema';
import { proyectosMinerosTiposTable } from '@/db/schemas/proyectos-mineros-tipos.schema';
import { proyectosMinerosEtapasTable } from '@/db/schemas/proyectos-mineros-etapas.schema';

const filtrosSchema = z.object({
  nombreLike: z.string().optional(),
  tiposIds: z.array(z.number().int().positive()).optional(),
  etapasIds: z.array(z.number().int().positive()).optional(),
  minerales: z.array(z.string()).optional(),
  ubicaciones: z.array(z.string()).optional(),
  propietarios: z.array(z.string()).optional(),
  provinciasGeologicas: z.array(z.string()).optional(),
  convenioEmse: z.boolean().optional(),
  visibleBase: z.boolean().optional(),
  visible: z.boolean().optional(),
  msnmDesde: z.number().int().optional(),
  msnmHasta: z.number().int().optional(),
});

interface DistribucionItem {
  id?: number;
  nombre: string;
  cantidad: number;
  color?: string;
  esAgrupado?: boolean;
}

function ordenarDistribucion<T extends DistribucionItem>(items: T[]) {
  return [...items].sort(
    (a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre)
  );
}

function limitarConOtros(items: DistribucionItem[], maximo = 10) {
  const ordenados = ordenarDistribucion(items);

  if (ordenados.length <= maximo) {
    return ordenados;
  }

  const principales = ordenados.slice(0, maximo - 1);
  const cantidadOtros = ordenados
    .slice(maximo - 1)
    .reduce((total, item) => total + item.cantidad, 0);

  return [
    ...principales,
    {
      nombre: 'Otros',
      cantidad: cantidadOtros,
      esAgrupado: true,
    },
  ];
}

export const getProyectosMinerosStatsFn = createServerFn({
  method: 'GET',
})
  .validator(filtrosSchema)
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
      visibleBase,
      visible,
      msnmDesde,
      msnmHasta,
    } = data;

    // Restricción permanente de la vista. Para visitantes, evita incluir
    // proyectos ocultos tanto en el resumen filtrado como en el total general.
    const condicionesBase =
      visibleBase === undefined
        ? undefined
        : eq(proyectosMinerosTable.visible, visibleBase);

    const condicionesFiltradas = and(
      condicionesBase,
      nombreLike?.trim()
        ? ilike(proyectosMinerosTable.nombre, `%${nombreLike.trim()}%`)
        : undefined,
      tiposIds?.length
        ? inArray(proyectosMinerosTable.tipoId, tiposIds)
        : undefined,
      etapasIds?.length
        ? inArray(proyectosMinerosTable.etapaId, etapasIds)
        : undefined,
      minerales?.length
        ? inArray(proyectosMinerosTable.mineralInteres, minerales)
        : undefined,
      ubicaciones?.length
        ? inArray(proyectosMinerosTable.ubicacion, ubicaciones)
        : undefined,
      propietarios?.length
        ? inArray(proyectosMinerosTable.propietario, propietarios)
        : undefined,
      provinciasGeologicas?.length
        ? inArray(
            proyectosMinerosTable.provinciaGeologica,
            provinciasGeologicas
          )
        : undefined,
      convenioEmse === undefined
        ? undefined
        : eq(proyectosMinerosTable.convenioEmse, convenioEmse),
      visible === undefined
        ? undefined
        : eq(proyectosMinerosTable.visible, visible),
      msnmDesde === undefined
        ? undefined
        : gte(proyectosMinerosTable.msnm, msnmDesde),
      msnmHasta === undefined
        ? undefined
        : lte(proyectosMinerosTable.msnm, msnmHasta)
    );

    const [
      resumenFiltradoRows,
      resumenGeneralRows,
      etapasRows,
      mineralesRows,
      tiposRows,
      ubicacionesRows,
    ] = await Promise.all([
      db
        .select({
          totalProyectos: count(),
          superficieAcumuladaHectareas: sql<string>`coalesce(sum(${proyectosMinerosTable.areaHectareas}), 0)`,
        })
        .from(proyectosMinerosTable)
        .where(condicionesFiltradas),

      db
        .select({
          totalProyectos: count(),
          superficieAcumuladaHectareas: sql<string>`coalesce(sum(${proyectosMinerosTable.areaHectareas}), 0)`,
        })
        .from(proyectosMinerosTable)
        .where(condicionesBase),

      db
        .select({
          id: proyectosMinerosEtapasTable.id,
          nombre: proyectosMinerosEtapasTable.nombre,
          color: proyectosMinerosEtapasTable.color,
          cantidad: count(),
        })
        .from(proyectosMinerosTable)
        .innerJoin(
          proyectosMinerosEtapasTable,
          eq(proyectosMinerosTable.etapaId, proyectosMinerosEtapasTable.id)
        )
        .where(condicionesFiltradas)
        .groupBy(
          proyectosMinerosEtapasTable.id,
          proyectosMinerosEtapasTable.nombre,
          proyectosMinerosEtapasTable.color
        ),

      db
        .select({
          nombre: proyectosMinerosTable.mineralInteres,
          cantidad: count(),
        })
        .from(proyectosMinerosTable)
        .where(condicionesFiltradas)
        .groupBy(proyectosMinerosTable.mineralInteres),

      db
        .select({
          id: proyectosMinerosTiposTable.id,
          nombre: proyectosMinerosTiposTable.nombre,
          cantidad: count(),
        })
        .from(proyectosMinerosTable)
        .innerJoin(
          proyectosMinerosTiposTable,
          eq(proyectosMinerosTable.tipoId, proyectosMinerosTiposTable.id)
        )
        .where(condicionesFiltradas)
        .groupBy(
          proyectosMinerosTiposTable.id,
          proyectosMinerosTiposTable.nombre
        ),

      db
        .select({
          nombre: proyectosMinerosTable.ubicacion,
          cantidad: count(),
        })
        .from(proyectosMinerosTable)
        .where(condicionesFiltradas)
        .groupBy(proyectosMinerosTable.ubicacion),
    ]);

    const resumenFiltrado = resumenFiltradoRows[0];
    const resumenGeneral = resumenGeneralRows[0];

    return {
      totalProyectos: resumenFiltrado?.totalProyectos ?? 0,
      superficieAcumuladaHectareas: Number(
        resumenFiltrado?.superficieAcumuladaHectareas ?? 0
      ),
      totalGeneral: resumenGeneral?.totalProyectos ?? 0,
      superficieGeneralHectareas: Number(
        resumenGeneral?.superficieAcumuladaHectareas ?? 0
      ),
      porEtapa: ordenarDistribucion(etapasRows),
      porMineral: limitarConOtros(mineralesRows),
      porTipo: ordenarDistribucion(tiposRows),
      porUbicacion: limitarConOtros(ubicacionesRows),
    };
  });
