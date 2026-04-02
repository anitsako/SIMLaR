import { geometry, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const aeropuertosTable = pgTable('aeropuertos', {
  id: serial('id').primaryKey(),
  geom: geometry('geom', { type: 'point', srid: 4326 }).notNull(),
  nombre: varchar('nombre', { length: 40 }).notNull(),
  tipo: varchar('tipo', { length: 50 }).notNull(),
});
