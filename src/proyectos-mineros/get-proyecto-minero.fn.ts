import { createServerFn } from '@tanstack/react-start';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { archivosTable } from '../db/schemas/archivos.schema';
import { proyectosMinerosTable } from '../db/schemas/proyectos-mineros.schema';
import { proyectosMinerosTiposTable } from '@/db/schemas/proyectos-mineros-tipos.schema';
import { proyectosMinerosEtapasTable } from '@/db/schemas/proyectos-mineros-etapas.schema';

export const getProyectoMineroFn = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    return db
      .select({
        id: proyectosMinerosTable.id,
        nombre: proyectosMinerosTable.nombre,
        tipo: {
          id: proyectosMinerosTiposTable.id,
          nombre: proyectosMinerosTiposTable.nombre,
          forma: proyectosMinerosTiposTable.forma,
        },
        ubicacion: proyectosMinerosTable.ubicacion,
        provinciaGeologica: proyectosMinerosTable.provinciaGeologica,
        area: proyectosMinerosTable.area,
        areaHectareas: proyectosMinerosTable.areaHectareas,
        litologia: proyectosMinerosTable.litologia,
        mineralizacion: proyectosMinerosTable.mineralizacion,
        mineralInteres: proyectosMinerosTable.mineralInteres,
        modeloGenetico: proyectosMinerosTable.modeloGenetico,
        accesos: proyectosMinerosTable.accesos,
        etapa: {
          id: proyectosMinerosEtapasTable.id,
          nombre: proyectosMinerosEtapasTable.nombre,
          color: proyectosMinerosEtapasTable.color,
        },
        propietario: proyectosMinerosTable.propietario,
        localidadesCercanas: proyectosMinerosTable.localidadesCercanas,
        coordenadasGeograficas: proyectosMinerosTable.coordenadasGeograficas,
        msnm: proyectosMinerosTable.msnm,
        convenioEmse: proyectosMinerosTable.convenioEmse,
        visible: proyectosMinerosTable.visible,
        archivoMapa: {
          id: archivosTable.id,
          nombre: archivosTable.nombre,
        },
        fechaCreacion: proyectosMinerosTable.fechaCreacion,
        fechaModificacion: proyectosMinerosTable.fechaModificacion,
      })
      .from(proyectosMinerosTable)
      .innerJoin(proyectosMinerosTiposTable, eq(proyectosMinerosTable.tipoId, proyectosMinerosTiposTable.id))
      .innerJoin(proyectosMinerosEtapasTable, eq(proyectosMinerosTable.etapaId, proyectosMinerosEtapasTable.id))
      .innerJoin(archivosTable, eq(proyectosMinerosTable.archivoMapaId, archivosTable.id))
      .where(eq(proyectosMinerosTable.id, data.id))
      .then((r) => r[0] ?? null);
  });
