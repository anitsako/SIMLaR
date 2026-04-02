import { createServerFn } from '@tanstack/react-start';
import { sql } from 'drizzle-orm';
import { db } from '../db';
import type { Point } from 'geojson';
import { aeropuertosTable } from '@/db/schemas/aeropuertos.schema';

export const getAeropuertos = createServerFn({ method: 'GET' }).handler(async () => {
  return db
    .select({
      id: aeropuertosTable.id,
      geom: sql<Point>`ST_AsGeoJSON(${aeropuertosTable.geom})::json`,
      nombre: aeropuertosTable.nombre,
      tipo: aeropuertosTable.tipo,
    })
    .from(aeropuertosTable);
});
