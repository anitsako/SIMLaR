import { createServerFn } from '@tanstack/react-start';
import { sql } from 'drizzle-orm';
import { db } from '../db';
import type { MultiLineString } from 'geojson';
import { riosTable } from '@/db/schemas/rios.schema';

export const getRiosFn = createServerFn({ method: 'GET' }).handler(async () => {
  return db
    .select({
      id: riosTable.id,
      geom: sql<MultiLineString>`ST_AsGeoJSON(${riosTable.geom})::json`,
      nombre: riosTable.nombre,
      distancia: riosTable.distancia,
    })
    .from(riosTable);
});
