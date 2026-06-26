import { createServerFn } from '@tanstack/react-start';
import { sql } from 'drizzle-orm';
import { db } from '../db';
import type { MultiLineString } from 'geojson';
import { riosIntermitentesTable } from '@/db/schemas/rios-intermitentes.schema';

export const getRiosIntermitentesFn = createServerFn({ method: 'GET' }).handler(async () => {
  return db
    .select({
      id: riosIntermitentesTable.id,
      geom: sql<MultiLineString>`ST_AsGeoJSON(${riosIntermitentesTable.geom})::json`,
      nombre: riosIntermitentesTable.nombre,
    })
    .from(riosIntermitentesTable);
});
