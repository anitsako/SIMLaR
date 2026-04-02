import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { multilinestring } from '../custom-types';

export const riosTable = pgTable('rios', {
  id: serial('id').primaryKey(),
  geom: multilinestring('geom', { srid: 4326 }).notNull(),
  nombre: varchar('nombre', { length: 254 }).notNull(),
  distancia: integer('distancia').notNull(),
});
