import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { multilinestring } from '../custom-types';

export const rutasProvincialesTable = pgTable('rutas_provinciales', {
  id: serial('id').primaryKey(),
  geom: multilinestring('geom', { srid: 4326 }).notNull(),
  nombre: varchar('nombre', { length: 30 }).notNull(),
  jurisdiccion: varchar('jurisdiccion', { length: 25 }).notNull(),
  clase: varchar('clase', { length: 22 }).notNull(),
});
