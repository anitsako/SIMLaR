import { createServerFn } from '@tanstack/react-start';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { archivosTable } from '../db/schemas/archivos.schema';
import { metaliferosTable } from '../db/schemas/metaliferos.schema';

export const getMetaliferoFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    return db
      .select({
        id: metaliferosTable.id,
        nombre: metaliferosTable.nombre,
        ubicacion: metaliferosTable.ubicacion,
        provinciaGeologica: metaliferosTable.provinciaGeologica,
        area: metaliferosTable.area,
        litologia: metaliferosTable.litologia,
        mineralizacion: metaliferosTable.mineralizacion,
        mineralInteres: metaliferosTable.mineralInteres,
        modeloGenetico: metaliferosTable.modeloGenetico,
        accesos: metaliferosTable.accesos,
        etapa: metaliferosTable.etapa,
        propietario: metaliferosTable.propietario,
        localidadesCercanas: metaliferosTable.localidadesCercanas,
        coordenadasGeograficas: metaliferosTable.coordenadasGeograficas,
        msnm: metaliferosTable.msnm,
        convenioEmse: metaliferosTable.convenioEmse,
        archivoMapa: {
          id: archivosTable.id,
          nombre: archivosTable.nombre,
        },
        fechaCreacion: metaliferosTable.fechaCreacion,
        fechaModificacion: metaliferosTable.fechaModificacion,
      })
      .from(metaliferosTable)
      .leftJoin(archivosTable, eq(metaliferosTable.archivoMapaId, archivosTable.id))
      .where(eq(metaliferosTable.id, data.id))
      .then((r) => r[0] ?? null);
  });
