import { createServerFn } from '@tanstack/react-start';
import { sql } from 'drizzle-orm';
import { db } from '../db';
import type { MultiLineString } from 'geojson';
import { rutasProvincialesTable } from '@/db/schemas/rutas-provinciales.schema';

export const getRutasProvinciales = createServerFn({ method: 'GET' }).handler(async () => {
  return db
    .select({
      id: rutasProvincialesTable.id,
      geom: sql<MultiLineString>`ST_AsGeoJSON(${rutasProvincialesTable.geom})::json`,
      nombre: rutasProvincialesTable.nombre,
      jurisdiccion: rutasProvincialesTable.jurisdiccion,
      clase: rutasProvincialesTable.clase,
    })
    .from(rutasProvincialesTable);
});
