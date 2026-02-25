import { createServerFn } from '@tanstack/react-start';
import { db } from '../db';
import { proyectosMinerosTable } from '../db/schemas/proyectos-mineros.schema';

export const getProyectosMinerosFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  return db
    .select({
      id: proyectosMinerosTable.id,
      nombre: proyectosMinerosTable.nombre,
      ubicacion: proyectosMinerosTable.ubicacion,
      mineral: proyectosMinerosTable.mineralInteres,
      etapa: proyectosMinerosTable.etapa,
      propietario: proyectosMinerosTable.propietario,
      coordenadasGeograficas: proyectosMinerosTable.coordenadasGeograficas,
    })
    .from(proyectosMinerosTable);
});
