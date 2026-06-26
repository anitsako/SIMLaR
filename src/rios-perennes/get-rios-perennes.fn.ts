import { createServerFn } from '@tanstack/react-start';
import { sql } from 'drizzle-orm';
import { db } from '../db';
import type { MultiLineString } from 'geojson';
import { riosPerennesTable } from '@/db/schemas/rios-perennes.schema';

export const getRiosPerennesFn = createServerFn({ method: 'GET' }).handler(async () => {
  return db
    .select({
      id: riosPerennesTable.id,
      geom: sql<MultiLineString>`ST_AsGeoJSON(${riosPerennesTable.geom})::json`,
      nombre: riosPerennesTable.nombre,
    })
    .from(riosPerennesTable);
});
