import { createServerFn } from '@tanstack/react-start';
import { sql } from 'drizzle-orm';
import { db } from '../db';
import type { Point } from 'geojson';
import { cerrosTable } from '@/db/schemas/cerros.schema';

export const getCerrosFn = createServerFn({ method: 'GET' }).handler(async () => {
  return db
    .select({
      id: cerrosTable.id,
      geom: sql<Point>`ST_AsGeoJSON(${cerrosTable.geom})::json`,
      nombre: cerrosTable.nombre,
      tipo: cerrosTable.tipo,
    })
    .from(cerrosTable);
});
