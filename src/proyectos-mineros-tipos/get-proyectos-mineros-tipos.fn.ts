import { createServerFn } from '@tanstack/react-start';
import { db } from '../db';
import { proyectosMinerosTiposTable } from '@/db/schemas/proyectos-mineros-tipos.schema';

export const getProyectosMinerosTiposFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  return db
    .select({
      id: proyectosMinerosTiposTable.id,
      nombre: proyectosMinerosTiposTable.nombre,
      color: proyectosMinerosTiposTable.color,
    })
    .from(proyectosMinerosTiposTable)
    .orderBy(proyectosMinerosTiposTable.nombre);
});
