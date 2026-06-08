import { pgTable, serial, uuid, varchar } from 'drizzle-orm/pg-core';
import { multipolygon } from '../custom-types';
import { archivosTable } from './archivos.schema';

export const departamentosTable = pgTable('departamentos', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 50 }).notNull(),
  geom: multipolygon('geom', { srid: 4326 }).notNull(),
  archivoImagenId: uuid('archivo_imagen_id').references(() => archivosTable.id),
});
