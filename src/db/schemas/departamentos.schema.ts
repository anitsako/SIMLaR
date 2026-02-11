import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { multipolygon } from '../custom-types';

export const departamentosTable = pgTable('departamentos', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 50 }).notNull(),
  geom: multipolygon('geom', { srid: 4326 }).notNull(),
});
