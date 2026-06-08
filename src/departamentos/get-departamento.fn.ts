import { createServerFn } from '@tanstack/react-start';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { archivosTable } from '../db/schemas/archivos.schema';
import type { MultiPolygon } from 'geojson';
import { departamentosTable } from '@/db/schemas/departamentos.schema';

export const getDepartamentoFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    return db
      .select({
        id: departamentosTable.id,
        nombre: departamentosTable.nombre,
        geom: sql<MultiPolygon>`ST_AsGeoJSON(${departamentosTable.geom})::json`,
        archivoImagen: {
          id: archivosTable.id,
          nombre: archivosTable.nombre,
        },
      })
      .from(departamentosTable)
      .leftJoin(archivosTable, eq(departamentosTable.archivoImagenId, archivosTable.id))
      .where(eq(departamentosTable.id, data.id))
      .then((r) => r[0] ?? null);
  });
