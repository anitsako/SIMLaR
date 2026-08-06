import { createServerFn } from '@tanstack/react-start';
import { sql } from 'drizzle-orm';
import { db } from '../db';
import type { MultiLineString } from 'geojson';
import { servidumbresTable } from '@/db/schemas/servidumbres.schema';

export const getServidumbresFn = createServerFn({ method: 'GET' }).handler(async () => {
  return db
    .select({
      id: servidumbresTable.id,
      geom: sql<MultiLineString>`ST_AsGeoJSON(${servidumbresTable.geom})::json`,
      nombre: servidumbresTable.nombre,
    })
    .from(servidumbresTable);
});
