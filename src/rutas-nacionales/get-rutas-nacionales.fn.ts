import { createServerFn } from '@tanstack/react-start';
import { sql } from 'drizzle-orm';
import { db } from '../db';
import type { MultiLineString } from 'geojson';
import { rutasNacionalesTable } from '@/db/schemas/rutas-nacionales.schema';

export const getRutasNacionalesFn = createServerFn({ method: 'GET' }).handler(async () => {
  return db
    .select({
      id: rutasNacionalesTable.id,
      geom: sql<MultiLineString>`ST_AsGeoJSON(${rutasNacionalesTable.geom})::json`,
      nombre: rutasNacionalesTable.nombre,
      jurisdiccion: rutasNacionalesTable.jurisdiccion,
      clase: rutasNacionalesTable.clase,
    })
    .from(rutasNacionalesTable);
});
