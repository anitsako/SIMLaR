import { createServerFn } from '@tanstack/react-start';
import { sql } from 'drizzle-orm';
import { db } from '../db';
import type { MultiPolygon } from 'geojson';
import { diquesTable } from '@/db/schemas/diques.schema';

export const getDiques = createServerFn({ method: 'GET' }).handler(async () => {
  return db
    .select({
      id: diquesTable.id,
      geom: sql<MultiPolygon>`ST_AsGeoJSON(${diquesTable.geom})::json`,
      nombre: diquesTable.nombre,
      superficie: diquesTable.superficie,
    })
    .from(diquesTable);
});
