import { pgTable, serial, uuid } from 'drizzle-orm/pg-core';
import { bytea } from '../custom-types';
import { archivosTable } from './archivos.schema';

export const archivosContenidosTable = pgTable('archivos_contenidos', {
  id: serial('id').primaryKey(),
  archivoId: uuid('archivo_id')
    .notNull()
    .references(() => archivosTable.id),
  contenido: bytea('contenido').notNull(),
});
