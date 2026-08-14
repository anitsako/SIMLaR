import { createServerFn } from '@tanstack/react-start';
import { sql } from 'drizzle-orm';
import { db } from '../db';
import type { MultiPolygon } from 'geojson';
import { areasProtegidasTable } from '@/db/schemas/areas-protegidas.schema';

export const getAreasProtegidasFn = createServerFn({ method: 'GET' }).handler(async () => {
  return db
    .select({
      id: areasProtegidasTable.id,
      geom: sql<MultiPolygon>`ST_AsGeoJSON(${areasProtegidasTable.geom})::json`,
      nombre: areasProtegidasTable.nombre,
      superficie: areasProtegidasTable.superficie,
    })
    .from(areasProtegidasTable);
});
