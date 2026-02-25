import { createServerFn } from '@tanstack/react-start';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { proyectosMinerosTable } from '../db/schemas/proyectos-mineros.schema';
import { proyectosMinerosTiposTable } from '@/db/schemas/proyectos-mineros-tipos.schema';

export const getProyectosMinerosFn = createServerFn({
  method: 'GET',
}).handler(async () => {
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
      mineral: proyectosMinerosTable.mineralInteres,
      etapa: proyectosMinerosTable.etapa,
      propietario: proyectosMinerosTable.propietario,
      coordenadasGeograficas: proyectosMinerosTable.coordenadasGeograficas,
    })
    .from(proyectosMinerosTable)
    .innerJoin(proyectosMinerosTiposTable, eq(proyectosMinerosTable.tipoId, proyectosMinerosTiposTable.id));
});
