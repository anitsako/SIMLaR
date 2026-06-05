import { createServerFn } from '@tanstack/react-start';
import { sql } from 'drizzle-orm';
import { db } from '../db';
import type { Point } from 'geojson';
import { refugiosTable } from '@/db/schemas/refugios.schema';

export const getRefugiosFn = createServerFn({ method: 'GET' }).handler(async () => {
  return db
    .select({
      id: refugiosTable.id,
      geom: sql<Point>`ST_AsGeoJSON(${refugiosTable.geom})::json`,
      nombre: refugiosTable.nombre,
      tipo: refugiosTable.tipo,
    })
    .from(refugiosTable);
});
