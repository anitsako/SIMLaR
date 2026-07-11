import { createServerFn } from '@tanstack/react-start';
import { asc, eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { departamentosTable } from '@/db/schemas/departamentos.schema';
import { indicadoresSocialesTable } from '@/db/schemas/indicadores-sociales.schema';

export const getDepartamentosIndicadoresFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  return db
    .select({
      id: departamentosTable.id,
      nombre: departamentosTable.nombre,

      tieneIndicadores: sql<boolean>`
        ${indicadoresSocialesTable.id} IS NOT NULL
      `,
    })
    .from(departamentosTable)
    .leftJoin(
      indicadoresSocialesTable,
      eq(
        departamentosTable.id,
        indicadoresSocialesTable.departamentoId
      )
    )
    .orderBy(asc(departamentosTable.nombre));
});