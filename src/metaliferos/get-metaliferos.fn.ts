import { createServerFn } from '@tanstack/react-start';
import { db } from '../db';
import { metaliferosTable } from '../db/schemas/metaliferos.schema';

export const getMetaliferosFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  return db
    .select({
      id: metaliferosTable.id,
      nombre: metaliferosTable.nombre,
      coordenadasGeograficas: metaliferosTable.coordenadasGeograficas,
    })
    .from(metaliferosTable);
});
