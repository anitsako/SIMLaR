import { createServerFn } from '@tanstack/react-start';
import { asc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { departamentosTable } from '@/db/schemas/departamentos.schema';

export const getDepartamentosImagenesFn = createServerFn({ method: 'GET' }).handler(async () => {
  return db
    .select({
      id: departamentosTable.id,
      nombre: departamentosTable.nombre,
      archivoImagen: { id: archivosTable.id, nombre: archivosTable.nombre },
    })
    .from(departamentosTable)
    .leftJoin(archivosTable, eq(departamentosTable.archivoImagenId, archivosTable.id))
    .orderBy(asc(departamentosTable.nombre));
});
