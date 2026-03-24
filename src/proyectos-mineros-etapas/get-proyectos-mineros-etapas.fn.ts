import { createServerFn } from '@tanstack/react-start';
import { db } from '../db';
import { proyectosMinerosEtapasTable } from '@/db/schemas/proyectos-mineros-etapas.schema';

export const getProyectosMinerosEtapasFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  return db
    .select({
      id: proyectosMinerosEtapasTable.id,
      nombre: proyectosMinerosEtapasTable.nombre,
      color: proyectosMinerosEtapasTable.color,
    })
    .from(proyectosMinerosEtapasTable)
    .orderBy(proyectosMinerosEtapasTable.nombre);
});
