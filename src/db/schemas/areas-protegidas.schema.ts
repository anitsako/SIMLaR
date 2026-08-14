import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { multipolygon } from '../custom-types';

export const areasProtegidasTable = pgTable('areas_protegidas', {
  id: serial('id').primaryKey(),
  geom: multipolygon('geom', { srid: 4326 }).notNull(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  superficie: integer('superficie').notNull(),
});
