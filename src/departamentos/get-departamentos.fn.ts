import { createServerFn } from '@tanstack/react-start';
import { sql } from 'drizzle-orm';
import { db } from '../db';
import { departamentosTable } from '../db/schemas/departamentos.schema';
import type { MultiPolygon } from 'geojson';

export const getDepartamentosFn = createServerFn({ method: 'GET' }).handler(async () => {
  return db
    .select({
      id: departamentosTable.id,
      nombre: departamentosTable.nombre,
      geom: sql<MultiPolygon>`ST_AsGeoJSON(${departamentosTable.geom})::json`,
      archivoImagenId: departamentosTable.archivoImagenId,
    })
    .from(departamentosTable);
});
