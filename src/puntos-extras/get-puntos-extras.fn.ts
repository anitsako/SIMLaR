import { createServerFn } from '@tanstack/react-start';
import { sql } from 'drizzle-orm';
import { db } from '../db';
import type { Point } from 'geojson';
import { puntosExtrasTable } from '@/db/schemas/puntos-extras.schema';

export const getPuntosExtrasFn = createServerFn({ method: 'GET' }).handler(async () => {
  return db
    .select({
      id: puntosExtrasTable.id,
      geom: sql<Point>`ST_AsGeoJSON(${puntosExtrasTable.geom})::json`,
      nombre: puntosExtrasTable.nombre,
      tipo: puntosExtrasTable.tipo,
    })
    .from(puntosExtrasTable);
});
