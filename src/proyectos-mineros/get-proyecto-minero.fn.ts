import { createServerFn } from '@tanstack/react-start';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { archivosTable } from '../db/schemas/archivos.schema';
import { proyectosMinerosTable } from '../db/schemas/proyectos-mineros.schema';
import { proyectosMinerosTiposTable } from '@/db/schemas/proyectos-mineros-tipos.schema';

export const getProyectoMineroFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    return db
      .select({
        id: proyectosMinerosTable.id,
        nombre: proyectosMinerosTable.nombre,
        tipo: {
          id: proyectosMinerosTiposTable.id,
          nombre: proyectosMinerosTiposTable.nombre,
          color: proyectosMinerosTiposTable.color,
        },
        ubicacion: proyectosMinerosTable.ubicacion,
        provinciaGeologica: proyectosMinerosTable.provinciaGeologica,
        area: proyectosMinerosTable.area,
        litologia: proyectosMinerosTable.litologia,
        mineralizacion: proyectosMinerosTable.mineralizacion,
        mineralInteres: proyectosMinerosTable.mineralInteres,
        modeloGenetico: proyectosMinerosTable.modeloGenetico,
        accesos: proyectosMinerosTable.accesos,
        etapa: proyectosMinerosTable.etapa,
        propietario: proyectosMinerosTable.propietario,
        localidadesCercanas: proyectosMinerosTable.localidadesCercanas,
        coordenadasGeograficas: proyectosMinerosTable.coordenadasGeograficas,
        msnm: proyectosMinerosTable.msnm,
        convenioEmse: proyectosMinerosTable.convenioEmse,
        archivoMapa: {
          id: archivosTable.id,
          nombre: archivosTable.nombre,
        },
        fechaCreacion: proyectosMinerosTable.fechaCreacion,
        fechaModificacion: proyectosMinerosTable.fechaModificacion,
      })
      .from(proyectosMinerosTable)
      .innerJoin(proyectosMinerosTiposTable, eq(proyectosMinerosTable.tipoId, proyectosMinerosTiposTable.id))
      .leftJoin(archivosTable, eq(proyectosMinerosTable.archivoMapaId, archivosTable.id))
      .where(eq(proyectosMinerosTable.id, data.id))
      .then((r) => r[0] ?? null);
  });
